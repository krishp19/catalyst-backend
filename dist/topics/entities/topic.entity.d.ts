import { Community } from '../../communities/entities/community.entity';
export declare class Topic {
    id: string;
    name: string;
    communityCount: number;
    communities: Community[];
    createdAt: Date;
    updatedAt: Date;
}
