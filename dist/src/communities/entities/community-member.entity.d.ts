import { User } from '../../users/entities/user.entity';
import { Community } from './community.entity';
export declare enum MemberRole {
    MEMBER = "member",
    MODERATOR = "moderator",
    ADMIN = "admin"
}
export declare class CommunityMember {
    id: string;
    user: User;
    userId: string;
    community: Community;
    communityId: string;
    role: MemberRole;
    joinedAt: Date;
}
