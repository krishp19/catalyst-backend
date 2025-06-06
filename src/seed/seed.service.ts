import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from '../tags/entities/tag.entity';
import { Topic } from '../topics/entities/topic.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Topic)
    private readonly topicRepository: Repository<Topic>,
  ) {}

  async onModuleInit(force: boolean = false) {
    const tagCount = await this.tagRepository.count();
    const topicCount = await this.topicRepository.count();

    if (tagCount === 0 || force) {
      if (force) {
        await this.tagRepository.clear();
      }
      await this.seedTags();
    }

    if (topicCount === 0 || force) {
      if (force) {
        await this.topicRepository.clear();
      }
      await this.seedTopics();
    }
  }

  private async seedTags() {
    const queryRunner = this.tagRepository.manager.connection.createQueryRunner();
    
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      
      await queryRunner.query('ALTER TABLE post_tags DISABLE TRIGGER ALL');
      await queryRunner.query('TRUNCATE TABLE post_tags CASCADE');
      await queryRunner.query('TRUNCATE TABLE tags CASCADE');
      await queryRunner.query('ALTER TABLE post_tags ENABLE TRIGGER ALL');
      
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
    
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
      { name: 'formula1', description: 'Formula 1 racing' }
    ];

    const tags = this.tagRepository.create(
      trendingTags.map(tag => ({
        ...tag,
        usageCount: 0, // Set usage count to 0 for all tags
      })),
    );

    await this.tagRepository.save(tags);
    console.log('Seeded tags successfully');
  }

  private async seedTopics() {
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

    const topics = this.topicRepository.create(
      trendingTopics.map(topic => ({
        ...topic,
        usageCount: Math.floor(Math.random() * 5000) + 1000,
      })),
    );

    await this.topicRepository.save(topics);
    console.log('Seeded topics successfully');
  }
}