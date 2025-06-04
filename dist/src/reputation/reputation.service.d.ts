import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
export declare class ReputationService {
    private usersRepository;
    private readonly POST_CREATION_POINTS;
    private readonly POST_UPVOTE_POINTS;
    private readonly POST_DOWNVOTE_POINTS;
    private readonly COMMENT_CREATION_POINTS;
    private readonly COMMENT_UPVOTE_POINTS;
    private readonly COMMENT_DOWNVOTE_POINTS;
    private readonly COMMUNITY_CREATION_POINTS;
    private readonly COMMUNITY_PARTICIPATION_POINTS;
    private readonly MONTHLY_DECAY_PERCENTAGE;
    constructor(usersRepository: Repository<User>);
    addPostCreationPoints(userId: string): Promise<void>;
    addPostUpvotePoints(userId: string): Promise<void>;
    addPostDownvotePoints(userId: string): Promise<void>;
    removePostUpvotePoints(userId: string): Promise<void>;
    removePostDownvotePoints(userId: string): Promise<void>;
    addCommentCreationPoints(userId: string): Promise<void>;
    addCommentUpvotePoints(userId: string): Promise<void>;
    addCommentDownvotePoints(userId: string): Promise<void>;
    removeCommentUpvotePoints(userId: string): Promise<void>;
    removeCommentDownvotePoints(userId: string): Promise<void>;
    addCommunityCreationPoints(userId: string): Promise<void>;
    addCommunityParticipationPoints(userId: string): Promise<void>;
    applyMonthlyDecay(): Promise<void>;
    private updateUserReputation;
}
