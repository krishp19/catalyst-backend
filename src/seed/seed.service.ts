import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Tag } from '../tags/entities/tag.entity';
import { Topic } from '../topics/entities/topic.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
    private dataSource: DataSource,
  ) {}

  async onModuleInit(force: boolean = false) {
    try {
      this.logger.log('Starting database seeding...');
      
      // Start a transaction
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        // Clear existing data if force is true
        if (force) {
          this.logger.log('Force option enabled, clearing existing data...');
          await queryRunner.query('TRUNCATE TABLE post_tags CASCADE');
          await queryRunner.query('TRUNCATE TABLE tags CASCADE');
          await queryRunner.query('TRUNCATE TABLE topics CASCADE');
        } else {
          // Check if we already have data
          const tagCount = await this.tagRepository.count();
          if (tagCount > 0) {
            this.logger.log('Database already seeded. Use force=true to reseed.');
            return;
          }
        }

        // Seed the database
        await this.seedTags(queryRunner);
        await this.seedTopics(queryRunner);
        
        // Commit transaction
        await queryRunner.commitTransaction();
        this.logger.log('Database seeded successfully!');
      } catch (err) {
        // Rollback transaction on error
        await queryRunner.rollbackTransaction();
        this.logger.error('Error seeding database:', err);
        throw err;
      } finally {
        // Release the query runner
        await queryRunner.release();
      }
    } catch (error) {
      this.logger.error('Failed to seed database:', error);
      throw error;
    }
  }

  private async seedTags(queryRunner: any) {
    this.logger.log('Seeding tags...');
    
    const trendingTags = [
      // General
      { name: 'discussion', description: 'General discussions on any topic' },
      { name: 'askreddit', description: 'Ask the community anything' },
      { name: 'todayilearned', description: 'Share interesting facts' },
      { name: 'explainlikeimfive', description: 'Simplified explanations' },
      { name: 'unpopularopinion', description: 'Share your unpopular opinions' },
      { name: 'changemyview', description: 'Challenge perspectives' },
      
      // News & Politics
      { name: 'news', description: 'Breaking news from around the world' },
      { name: 'worldnews', description: 'International news' },
      { name: 'politics', description: 'Political news and discussions' },
      { name: 'technology', description: 'Tech news and discussions' },
      { name: 'science', description: 'Scientific discoveries and discussions' },
      
      // Entertainment
      { name: 'movies', description: 'Film discussions and news' },
      { name: 'television', description: 'TV shows and series' },
      { name: 'gaming', description: 'Video game discussions' },
      { name: 'music', description: 'All genres of music' },
      { name: 'books', description: 'Book discussions and recommendations' },
      { name: 'art', description: 'Visual arts and creativity' },
      { name: 'food', description: 'Culinary discussions and recipes' },
      
      // Lifestyle
      { name: 'lifeprotips', description: 'Life hacks and tips' },
      { name: 'personalfinance', description: 'Money management advice' },
      { name: 'fitness', description: 'Exercise and health' },
      { name: 'travel', description: 'Travel tips and experiences' },
      { name: 'fashion', description: 'Clothing and style' },
      { name: 'homeimprovement', description: 'DIY home projects' },
      
      // Humor & Fun
      { name: 'funny', description: 'Humor and jokes' },
      { name: 'memes', description: 'Internet memes' },
      { name: 'gifs', description: 'Animated GIFs' },
      { name: 'aww', description: 'Cute and cuddly' },
      { name: 'wholesomememes', description: 'Positive and uplifting memes' },
      
      // Technology
      { name: 'programming', description: 'Software development' },
      { name: 'webdev', description: 'Web development' },
      { name: 'gadgets', description: 'Cool tech gadgets' },
      
      // NSFW
      { name: 'nsfw', description: 'Not safe for work content (18+)' },
      { name: 'adultcontent', description: 'Mature user-submitted content (18+)' },
      { name: 'mature', description: 'Adult-themed discussions (18+)' },
      
      // Hobbies & Interests
      { name: 'photography', description: 'Photo sharing and tips' },
      { name: 'gardening', description: 'Gardening tips and photos' },
      { name: 'cooking', description: 'Recipes and cooking tips' },
      { name: 'woodworking', description: 'Woodworking projects' },
      { name: 'boardgames', description: 'Tabletop gaming' },
      
      // Sports
      { name: 'soccer', description: 'Football/soccer' },
      { name: 'nba', description: 'NBA basketball' },
      { name: 'nfl', description: 'NFL football' },
      { name: 'formula1', description: 'Formula 1 racing' },
      { name: 'cricket', description: 'Cricket' },
      { name: 'tennis', description: 'Tennis' },
      { name: 'golf', description: 'Golf' },
      { name: 'olympics', description: 'Olympic Games' },
      
      // Anime & Manga
      { name: 'anime', description: 'Japanese animation' },
      { name: 'manga', description: 'Japanese comics' },
      { name: 'cosplay', description: 'Costume play' },
      { name: 'animefigures', description: 'Anime figures and collectibles' },
      { name: 'animewallpaper', description: 'Anime wallpapers' },
      { name: 'animememes', description: 'Anime memes' },
      
      // NSFW Categories
      { name: 'nsfw', description: 'Not Safe For Work content' },
      { name: 'nsfwanime', description: 'NSFW Anime content' },
      { name: 'ecchi', description: 'Ecchi anime/manga' },
      { name: 'hentai', description: 'Hentai content' },
      { name: 'rule34', description: 'Rule 34 content' },
      
      // Memes & Humor
      { name: 'memes', description: 'Internet memes' },
      { name: 'dankmemes', description: 'Dank memes' },
      { name: 'wholesomememes', description: 'Wholesome memes' },
      { name: 'me_irl', description: 'Me in real life' },
      { name: 'funny', description: 'Funny content' },
      
      // Technology & Gaming
      { name: 'programming', description: 'Computer programming' },
      { name: 'gaming', description: 'Video games' },
      { name: 'pcgaming', description: 'PC gaming' },
      { name: 'ps5', description: 'PlayStation 5' },
      { name: 'xbox', description: 'Xbox gaming' },
      { name: 'nintendoswitch', description: 'Nintendo Switch' },
      { name: 'minecraft', description: 'Minecraft' },
      
      // Entertainment
      { name: 'movies', description: 'Films and cinema' },
      { name: 'television', description: 'TV shows' },
      { name: 'netflix', description: 'Netflix shows' },
      { name: 'marvel', description: 'Marvel Cinematic Universe' },
      { name: 'startrek', description: 'Star Trek' },
      { name: 'starwars', description: 'Star Wars' },
      
      // Other Popular Categories
      { name: 'askreddit', description: 'Ask Reddit' },
      { name: 'todayilearned', description: 'Today I Learned' },
      { name: 'explainlikeimfive', description: 'Explain Like I\'m Five' },
      { name: 'showerthoughts', description: 'Shower thoughts' },
      { name: 'lifeprotips', description: 'Life Pro Tips' },
      { name: 'unpopularopinion', description: 'Unpopular opinions' },
      { name: 'changemyview', description: 'Change My View' },
      { name: 'amitheasshole', description: 'Am I The Asshole' }
    ];

    // Insert tags in batches to avoid parameter limits
    const batchSize = 100;
    for (let i = 0; i < trendingTags.length; i += batchSize) {
      const batch = trendingTags.slice(i, i + batchSize);
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Tag)
        .values(
          batch.map(tag => ({
            ...tag,
            usageCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          }))
        )
        .orIgnore() // Skip duplicates
        .execute();
    }
    
    this.logger.log(`Seeded ${trendingTags.length} tags successfully`);
  }

  private async seedTopics(queryRunner: any) {
    this.logger.log('Seeding topics...');
    
    const trendingTopics = [
      // General Interest
      { name: 'AskReddit', description: 'Ask and answer thought-provoking questions' },
      { name: 'Today I Learned', description: 'Share interesting tidbits' },
      { name: 'Explain Like I\'m Five', description: 'Simplified explanations' },
      { name: 'NoStupidQuestions', description: 'Ask without judgement' },
      { name: 'Unpopular Opinion', description: 'Share controversial opinions' },
      { name: 'Change My View', description: 'Challenge your beliefs' },
      
      // News & Politics
      { name: 'World News', description: 'International news' },
      { name: 'Politics', description: 'Political discussions' },
      { name: 'Technology', description: 'Tech news and trends' },
      { name: 'Science', description: 'Scientific discoveries' },
      { name: 'Environment', description: 'Environmental issues' },
      
      // Entertainment
      { name: 'Movies', description: 'Film discussions' },
      { name: 'Television', description: 'TV shows and series' },
      { name: 'Gaming', description: 'Video games' },
      { name: 'Music', description: 'All music genres' },
      { name: 'Books', description: 'Book recommendations' },
      { name: 'Art', description: 'Visual arts' },
      { name: 'Food', description: 'Recipes and culinary tips' },
      
      // Lifestyle
      { name: 'Life Pro Tips', description: 'Life improvement tips' },
      { name: 'Personal Finance', description: 'Money management' },
      { name: 'Fitness', description: 'Health and exercise' },
      { name: 'Travel', description: 'Travel experiences' },
      { name: 'Fashion', description: 'Style and clothing' },
      { name: 'Home Improvement', description: 'DIY home projects' },
      
      // Humor & Fun
      { name: 'Funny', description: 'Humor and jokes' },
      { name: 'Memes', description: 'Internet memes' },
      { name: 'GIFs', description: 'Animated GIFs' },
      { name: 'Aww', description: 'Cute content' },
      { name: 'Wholesome Memes', description: 'Uplifting memes' },
      { name: 'Programmer Humor', description: 'Coding jokes' },
      { name: 'Shower–Thoughts', description: 'Random insights' },
      { name: 'TIFU', description: 'Funny mistake stories' },
      
      // NSFW
      { name: 'NSFW', description: 'Not safe for work content (18+)' },
      { name: 'GoneWild', description: 'User-submitted adult content (18+)' },
      { name: 'NSFW_Art', description: 'Mature artwork (18+)' },
      
      // Technology & Programming
      { name: 'Programming', description: 'Software development' },
      { name: 'Web Development', description: 'Web technologies' },
      { name: 'JavaScript Ecosystem', description: 'JavaScript, TypeScript, Node.js' },
      { name: 'Python Programming', description: 'Python development' },
      { name: 'Web Frameworks', description: 'React, Vue, Angular, Django, etc.' },
      { name: 'DevOps', description: 'CI/CD, Docker, Kubernetes' },
      { name: 'Cloud Computing', description: 'AWS, Azure, GCP' },
      { name: 'Data Science', description: 'Data analysis and ML' },
      { name: 'Cybersecurity', description: 'Security practices' },
      { name: 'Learn Programming', description: 'Coding tutorials' },
      
      // Hobbies & Interests
      { name: 'Photography', description: 'Photo sharing and tips' },
      { name: 'Gardening', description: 'Gardening advice' },
      { name: 'Cooking', description: 'Recipes and tips' },
      { name: 'Woodworking', description: 'Woodworking projects' },
      { name: 'Board Games', description: 'Tabletop gaming' },
      
      // Sports
      { name: 'Sports', description: 'General sports' },
      { name: 'Soccer', description: 'Football/soccer' },
      { name: 'NBA', description: 'Basketball' },
      { name: 'NFL', description: 'American football' },
      { name: 'Formula 1', description: 'F1 racing' },
      
      // Communities
      { name: 'AMA', description: 'Ask Me Anything' },
      { name: 'Casual Conversation', description: 'Relaxed chats' },
      { name: 'Off My Chest', description: 'Personal thoughts' },
      { name: 'Confession', description: 'Anonymous confessions' },
      { name: 'Rant', description: 'Vent frustrations' }
    ];

    // Insert topics in batches to avoid parameter limits
    const batchSize = 100;
    for (let i = 0; i < trendingTopics.length; i += batchSize) {
      const batch = trendingTopics.slice(i, i + batchSize);
      await queryRunner.manager
        .createQueryBuilder()
        .insert()
        .into(Topic)
        .values(
          batch.map(topic => ({
            ...topic,
            usageCount: Math.floor(Math.random() * 5000) + 1000,
            createdAt: new Date(),
            updatedAt: new Date(),
          }))
        )
        .orIgnore() // Skip duplicates
        .execute();
    }
    
    this.logger.log(`Seeded ${trendingTopics.length} topics successfully`);
  }
}