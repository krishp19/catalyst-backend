import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';
import { CommunityMember } from './community-member.entity';
import { Topic } from '../../topics/entities/topic.entity';
export declare class Community {
    id: string;
    name: string;
    description: string;
    bannerUrl: string;
    iconUrl: string;
    memberCount: number;
    creator: User;
    creatorId: string;
    settings: Record<string, any>;
    posts: Post[];
    members: CommunityMember[];
    topics: Topic[];
    createdAt: Date;
    updatedAt: Date;
}
