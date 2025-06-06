import { SeedService } from './seed.service';
export declare class SeedController {
    private readonly seedService;
    constructor(seedService: SeedService);
    seed(force: boolean): Promise<{
        message: string;
        forceReseed: boolean;
    }>;
}
