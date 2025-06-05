import { Community } from '../entities/community.entity';

export interface CommunityWithJoinedStatus extends Community {
  isJoined: boolean;
}
