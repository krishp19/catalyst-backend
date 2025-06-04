import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';
import { CommunityMember } from './community-member.entity';
export declare class Community {
    id: string;
    name: string;
    description: string;
    bannerUrl: string;
    iconUrl: string;
    memberCount: number;
    creator: User;
    creatorId: string;
    posts: Post[];
    members: CommunityMember[];
    createdAt: Date;
    updatedAt: Date;
}
