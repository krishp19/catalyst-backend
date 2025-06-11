import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Community } from 'src/communities/entities/community.entity';
import { Post } from 'src/posts/entities/post.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Vote } from 'src/votes/entities/vote.entity';
import { UserProfileDto } from './dto/user-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(Vote)
    private votesRepository: Repository<Vote>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if user with same email or username already exists
    const existingUser = await this.usersRepository.findOne({
      where: [
        { email: createUserDto.email },
        { username: createUserDto.username },
      ],
    });

    if (existingUser) {
      if (existingUser.email === createUserDto.email) {
        throw new ConflictException('Email already in use');
      } else {
        throw new ConflictException('Username already taken');
      }
    }

    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findAll(page = 1, limit = 10) {
    const [users, total] = await this.usersRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      items: users,
      meta: {
        totalItems: total,
        itemCount: users.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    };
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    
    // Check for email uniqueness if it's being updated
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });
      
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
    }
    
    // Update user properties
    Object.assign(user, updateUserDto);
    
    return this.usersRepository.save(user);
  }

  async getEnhancedProfile(username: string, includeContent = true): Promise<UserProfileDto> {
    const user = await this.usersRepository.findOne({
      where: { username },
      relations: ['posts', 'comments', 'votes']
    });

    if (!user) {
      throw new NotFoundException(`User with username ${username} not found`);
    }

    const userProfile = new UserProfileDto(user);

    if (!includeContent) {
      return userProfile;
    }

    // Get user's posts with relations
    const posts = await this.postsRepository.find({
      where: { authorId: user.id },
      relations: ['author', 'community', 'tags'],
      order: { createdAt: 'DESC' },
      take: 10
    });

    // Get user's comments with relations
    const comments = await this.commentsRepository.find({
      where: { authorId: user.id },
      relations: ['author', 'post'],
      order: { createdAt: 'DESC' },
      take: 10
    });

    // Get user's votes with relations to posts and comments
    const votes = await this.votesRepository.find({
      where: { userId: user.id },
      relations: ['post', 'comment', 'post.author', 'comment.author']
    });

    // Separate upvoted and downvoted content
    const upvoted = [];
    const downvoted = [];

    for (const vote of votes) {
      if (vote.value > 0) {
        if (vote.post) {
          upvoted.push(vote.post);
        } else if (vote.comment) {
          upvoted.push(vote.comment);
        }
      } else if (vote.value < 0) {
        if (vote.post) {
          downvoted.push(vote.post);
        } else if (vote.comment) {
          downvoted.push(vote.comment);
        }
      }
    }

    // Add the data to the profile
    userProfile.posts = posts;
    userProfile.comments = comments;
    userProfile.upvoted = upvoted;
    userProfile.downvoted = downvoted;

    return userProfile;
  }

  async getReputationBreakdown(userId: string) {
    const user = await this.findById(userId);
    
    return {
      totalScore: user.reputationScore,
      breakdown: {
        fromPosts: user.postScore,
        fromComments: user.commentScore,
        fromCommunities: user.communityScore,
      },
    };
  }

  /**
   * Get all communities that the user has joined
   * @param userId - The ID of the user
   * @returns Array of communities the user has joined
   */
  async getJoinedCommunities(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['communityMemberships', 'communityMemberships.community'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Extract communities from memberships
    return user.communityMemberships?.map(membership => membership.community) || [];
  }
}