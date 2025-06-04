import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ReputationService {
  // Reputation point values
  private readonly POST_CREATION_POINTS = 5;
  private readonly POST_UPVOTE_POINTS = 10;
  private readonly POST_DOWNVOTE_POINTS = -2;
  
  private readonly COMMENT_CREATION_POINTS = 2;
  private readonly COMMENT_UPVOTE_POINTS = 5;
  private readonly COMMENT_DOWNVOTE_POINTS = -1;
  
  private readonly COMMUNITY_CREATION_POINTS = 20;
  private readonly COMMUNITY_PARTICIPATION_POINTS = 1;
  
  // Monthly decay percentage (5%)
  private readonly MONTHLY_DECAY_PERCENTAGE = 0.05;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async addPostCreationPoints(userId: string): Promise<void> {
    await this.updateUserReputation(userId, this.POST_CREATION_POINTS, 'postScore');
  }

  async addPostUpvotePoints(userId: string): Promise<void> {
    await this.updateUserReputation(userId, this.POST_UPVOTE_POINTS, 'postScore');
  }

  async addPostDownvotePoints(userId: string): Promise<void> {
    await this.updateUserReputation(userId, this.POST_DOWNVOTE_POINTS, 'postScore');
  }

  async removePostUpvotePoints(userId: string): Promise<void> {
    await this.updateUserReputation(userId, -this.POST_UPVOTE_POINTS, 'postScore');
  }

  async removePostDownvotePoints(userId: string): Promise<void> {
    await this.updateUserReputation(userId, -this.POST_DOWNVOTE_POINTS, 'postScore');
  }

  async addCommentCreationPoints(userId: string): Promise<void> {
    await this.updateUserReputation(userId, this.COMMENT_CREATION_POINTS, 'commentScore');
  }

  async addCommentUpvotePoints(userId: string): Promise<void> {
    await this.updateUserReputation(userId, this.COMMENT_UPVOTE_POINTS, 'commentScore');
  }

  async addCommentDownvotePoints(userId: string): Promise<void> {
    await this.updateUserReputation(userId, this.COMMENT_DOWNVOTE_POINTS, 'commentScore');
  }

  async removeCommentUpvotePoints(userId: string): Promise<void> {
    await this.updateUserReputation(userId, -this.COMMENT_UPVOTE_POINTS, 'commentScore');
  }

  async removeCommentDownvotePoints(userId: string): Promise<void> {
    await this.updateUserReputation(userId, -this.COMMENT_DOWNVOTE_POINTS, 'commentScore');
  }

  async addCommunityCreationPoints(userId: string): Promise<void> {
    await this.updateUserReputation(userId, this.COMMUNITY_CREATION_POINTS, 'communityScore');
  }

  async addCommunityParticipationPoints(userId: string): Promise<void> {
    await this.updateUserReputation(userId, this.COMMUNITY_PARTICIPATION_POINTS, 'communityScore');
  }

  async applyMonthlyDecay(): Promise<void> {
    // This method would be called by a scheduled task once a month
    const users = await this.usersRepository.find();
    
    for (const user of users) {
      const decayAmount = Math.floor(user.reputationScore * this.MONTHLY_DECAY_PERCENTAGE);
      
      if (decayAmount > 0) {
        user.reputationScore = Math.max(0, user.reputationScore - decayAmount);
        await this.usersRepository.save(user);
      }
    }
  }

  private async updateUserReputation(
    userId: string,
    points: number,
    scoreField: 'postScore' | 'commentScore' | 'communityScore',
  ): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      return;
    }
    
    // Update specific score field
    user[scoreField] = Math.max(0, user[scoreField] + points);
    
    // Update total reputation
    user.reputationScore = user.postScore + user.commentScore + user.communityScore;
    
    await this.usersRepository.save(user);
  }
}