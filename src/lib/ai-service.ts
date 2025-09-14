// AI Service for handling interview conversations
// This module provides interfaces for different AI providers (OpenAI, Claude, etc.)

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export interface InterviewContext {
  jobTitle: string;
  jobDescription: string;
  resumeContent: string;
  interviewerStyle: 'strict' | 'friendly' | 'open';
  companyName?: string;
  interviewType: 'technical' | 'behavioral' | 'comprehensive';
  duration: number;
}

export interface AIResponse {
  content: string;
  isComplete: boolean;
  suggestions?: string[];
  nextPhase?: string;
  error?: string;
  shouldShowEndButton?: boolean;
}

class AIInterviewService {
  private apiKey: string | null = null;
  private provider: 'zhipu' | 'mock' = 'zhipu';
  private conversationHistory: AIMessage[] = [];
  private interviewContext: InterviewContext | null = null;
  private currentPhase: string = 'introduction';
  private questionCount: number = 0;
  private readonly baseURL = 'https://open.bigmodel.cn/api/paas/v4';
  private readonly model = 'glm-4-flash';

  constructor() {
    // 使用智谱AI的API密钥
    this.apiKey = 'a39b3c2caa4c20edfc35d5e8cd8a9bc5.ZTuD0GCrVaS9n9BE';
    this.provider = this.apiKey ? 'zhipu' : 'mock';
  }

  setInterviewContext(context: InterviewContext) {
    this.interviewContext = context;
    this.conversationHistory = [];
    this.currentPhase = 'introduction';
    this.questionCount = 0;
    
    // Set up system prompt based on context
    const systemPrompt = this.generateSystemPrompt(context);
    this.conversationHistory.push({
      role: 'system',
      content: systemPrompt,
      timestamp: new Date()
    });
  }

  private generateSystemPrompt(context: InterviewContext): string {
    // 简历分析
    const analyzeResume = (resumeContent: string) => {
      const content = resumeContent.toLowerCase();
      const skillKeywords = ['javascript', 'python', 'java', 'react', 'vue', 'node', 'spring', 'mysql', 'redis', 'docker', 'kubernetes', 'aws', 'git', 'linux', 'html', 'css', 'typescript', 'mongodb', 'postgresql', 'nginx', 'jenkins', 'webpack', 'babel', 'sass', 'less', 'jquery', 'bootstrap', 'tailwind', 'express', 'koa', 'django', 'flask', 'laravel', 'php', 'c++', 'c#', 'go', 'rust', 'swift', 'kotlin', 'flutter', 'react native', 'android', 'ios', 'unity', 'tensorflow', 'pytorch', 'opencv', 'pandas', 'numpy', 'scikit-learn', 'elasticsearch', 'kafka', 'rabbitmq', 'microservice', 'devops', 'ci/cd', 'agile', 'scrum'];
      
      const skills = skillKeywords.filter(skill => content.includes(skill));
      const projectIndicators = ['项目', 'project', '开发', '设计', '实现', '负责', '参与', '主导', '搭建', '优化'];
      const projects = resumeContent.split('\n').filter(line => 
        projectIndicators.some(indicator => line.includes(indicator)) && line.length > 10
      ).map(line => line.trim());
      
      return { skills, projects };
    };
    
    const resumeAnalysis = analyzeResume(context.resumeContent);
    
    // 根据面试类型生成专门的提示词
    const getInterviewTypePrompt = () => {
      switch (context.interviewType) {
        case 'technical':
          return this.generateTechnicalInterviewPrompt(context, resumeAnalysis);
        case 'behavioral':
          return this.generateBehavioralInterviewPrompt(context, resumeAnalysis);
        case 'comprehensive':
          return this.generateComprehensiveInterviewPrompt(context, resumeAnalysis);
        default:
          return this.generateTechnicalInterviewPrompt(context, resumeAnalysis);
      }
    };
    
    return getInterviewTypePrompt();
  }
  
  // 技术面试专用提示词
  private generateTechnicalInterviewPrompt(context: InterviewContext, resumeAnalysis: any): string {
    const styleConfig = this.getInterviewerStyle(context.interviewerStyle);
    const timeConfig = this.getTimeStrategy(context.duration);
    
    return `# 🔧 技术面试官

你是一位资深技术面试官，专门负责${context.jobTitle}的技术能力评估。

## 面试官特征
${styleConfig}

## 候选人信息
**简历：** ${context.resumeContent}
**技能：** ${resumeAnalysis.skills.join(', ') || '待了解'}
**项目：** ${resumeAnalysis.projects.length}个相关项目

## 职位要求
${context.jobDescription}

## 面试策略
${timeConfig}

## 技术考察重点
1. **核心技术栈**：深入考察${context.jobTitle}相关的技术能力
2. **项目经验**：验证简历中项目的技术深度和个人贡献
3. **问题解决**：通过场景题考察解决技术问题的思路
4. **代码质量**：了解编码规范、测试、性能优化等意识
5. **技术视野**：评估对新技术的学习能力和行业理解

现在开始技术面试，先进行开场白，然后基于候选人简历中的技术栈提出第一个具体的技术问题。

## 重要输出要求
**请严格按照以下格式输出：**
- 直接输出面试官的话，不要添加任何前缀（如"面试官："）
- 不要使用任何格式标记（如**、##等）
- 不要包含候选人的占位符文本（如"**候选人**：（候选人进行自我介绍）"）
- 只输出纯净的面试官对话内容

示例正确格式：
"您好，很高兴今天能有机会与您进行技术面试。首先，请您简单介绍一下自己，以及您为什么对这个职位感兴趣。"

示例错误格式：
"**面试官**：您好，很高兴今天能有机会与您进行技术面试。**候选人**：（候选人进行自我介绍）"`;
  }
  
  // 行为面试专用提示词
  private generateBehavioralInterviewPrompt(context: InterviewContext, resumeAnalysis: any): string {
    const styleConfig = this.getInterviewerStyle(context.interviewerStyle);
    const timeConfig = this.getTimeStrategy(context.duration);
    
    return `# 👥 行为面试官

你是一位经验丰富的HR面试官，专门负责${context.jobTitle}的软技能和文化匹配度评估。

## 面试官特征
${styleConfig}

## 候选人信息
**简历：** ${context.resumeContent}
**工作经历：** ${resumeAnalysis.projects.length}段相关经验

## 职位要求
${context.jobDescription}

## 面试策略
${timeConfig}

## 行为考察重点
1. **团队协作**：了解在团队中的角色和协作方式
2. **沟通能力**：评估表达能力和倾听技巧
3. **问题解决**：通过STAR法则了解解决问题的方法
4. **学习成长**：考察学习能力和自我提升意识
5. **文化匹配**：评估价值观和工作态度是否符合企业文化
6. **抗压能力**：了解在压力下的表现和应对策略

现在开始行为面试，先进行温和的开场白，然后基于候选人的工作经历提出第一个行为问题。

## 重要输出要求
**请严格按照以下格式输出：**
- 直接输出面试官的话，不要添加任何前缀（如"面试官："）
- 不要使用任何格式标记（如**、##等）
- 不要包含候选人的占位符文本（如"**候选人**：（候选人进行自我介绍）"）
- 只输出纯净的面试官对话内容

示例正确格式：
"您好，很高兴今天能有机会与您进行面试。首先，请您简单介绍一下自己，以及您为什么对这个职位感兴趣。"

示例错误格式：
"**面试官**：您好，很高兴今天能有机会与您进行面试。**候选人**：（候选人进行自我介绍）"`;
  }
  
  // 综合面试专用提示词
  private generateComprehensiveInterviewPrompt(context: InterviewContext, resumeAnalysis: any): string {
    const styleConfig = this.getInterviewerStyle(context.interviewerStyle);
    const timeConfig = this.getTimeStrategy(context.duration);
    
    return `# 🎯 综合面试官

你是一位全能面试官，需要全面评估${context.jobTitle}候选人的技术能力和综合素质。

## 面试官特征
${styleConfig}

## 候选人信息
**简历：** ${context.resumeContent}
**技能：** ${resumeAnalysis.skills.join(', ') || '待了解'}
**经验：** ${resumeAnalysis.projects.length}个相关项目

## 职位要求
${context.jobDescription}

## 面试策略
${timeConfig}

## 综合考察重点
1. **技术能力**：核心技术栈的掌握程度和应用经验
2. **项目经验**：技术选型、架构设计、问题解决能力
3. **团队协作**：沟通能力、协作方式、领导潜力
4. **学习能力**：新技术学习、知识更新、自我提升
5. **职业规划**：发展方向、目标设定、职业成熟度
6. **文化匹配**：价值观、工作态度、团队融入度

现在开始综合面试，先进行专业的开场白，然后从技术能力开始，逐步深入到综合素质的考察。

## 重要输出要求
**请严格按照以下格式输出：**
- 直接输出面试官的话，不要添加任何前缀（如"面试官："）
- 不要使用任何格式标记（如**、##等）
- 不要包含候选人的占位符文本（如"**候选人**：（候选人进行自我介绍）"）
- 只输出纯净的面试官对话内容

示例正确格式：
"您好，很高兴今天能有机会与您进行综合面试。首先，请您简单介绍一下自己，以及您为什么对这个职位感兴趣。"

示例错误格式：
"**面试官**：您好，很高兴今天能有机会与您进行综合面试。**候选人**：（候选人进行自我介绍）"`;
  }
  
  // 获取面试官风格配置
  private getInterviewerStyle(style: string): string {
    switch (style) {
      case 'strict':
        return `**风格：** 严格专业型
- 追问细节，要求精确回答
- 适度施压，测试抗压能力
- 注重逻辑性和准确性
- 直接指出问题和不足`;
      case 'friendly':
        return `**风格：** 友好鼓励型
- 营造轻松愉快的氛围
- 鼓励候选人充分表达
- 关注潜力和成长性
- 给予积极正面的反馈`;
      case 'open':
        return `**风格：** 开放探索型
- 鼓励创新思维和想法
- 重视思考过程而非标准答案
- 探索式对话，深入讨论
- 关注适应性和发展潜力`;
      default:
        return `**风格：** 专业平衡型
- 客观公正，全面评估
- 结构化面试流程
- 平衡各个考察维度
- 标准化问题和评价`;
    }
  }
  
  // 获取时间策略配置
  private getTimeStrategy(duration: number): string {
    if (duration <= 15) {
      return `**时间策略：** 快速验证模式（${duration}分钟）
- 开场：1分钟简短介绍
- 核心考察：10分钟，3-4个关键问题
- 候选人提问：4分钟
- 重点：快速验证核心能力，避免复杂深入的讨论`;
    } else if (duration <= 30) {
      return `**时间策略：** 标准面试模式（${duration}分钟）
- 开场：3分钟破冰和简历概述
- 主要考察：20分钟，5-7个问题
- 候选人提问：5分钟
- 总结：2分钟
- 重点：平衡深度和广度，适度追问`;
    } else {
       return `**时间策略：** 深度面试模式（${duration}分钟）
 - 开场：5分钟详细了解背景
 - 深度考察：35分钟，8-12个问题
 - 候选人提问：8分钟
 - 总结：7分钟
 - 重点：深入探讨，全面评估，可包含复杂场景题`;
     }
   }

  async sendMessage(userMessage: string): Promise<AIResponse> {
    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    });

    try {
      let response: string;
      
      if (this.provider === 'mock') {
        response = await this.getMockResponse(userMessage);
      } else {
        response = await this.getZhipuAIResponse();
      }

      // Add AI response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: response,
        timestamp: new Date()
      });

      this.questionCount++;
      
      // 检查是否应该宣布面试结束
      if (this.shouldAnnounceEnd()) {
        this.currentPhase = 'ending';
        const endingMessage = this.generateEndingMessage();
        
        // 更新对话历史为结束语
        this.conversationHistory[this.conversationHistory.length - 1].content = endingMessage;
        
        return {
          content: endingMessage,
          isComplete: false, // 还未真正结束，等待用户确认
          nextPhase: 'ending',
          shouldShowEndButton: true // 新增字段，提示前端显示结束按钮
        };
      }
      
      // Determine if interview should continue
      const isComplete = this.shouldCompleteInterview();
      const nextPhase = this.determineNextPhase();

      return {
        content: response,
        isComplete,
        nextPhase,
        suggestions: this.generateSuggestions()
      };
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        content: '抱歉，我遇到了一些技术问题。请稍后再试，或者我们可以继续其他问题。',
        isComplete: false,
        error: error instanceof Error ? error.message : '未知错误'
      };
    }
  }

  private async getMockResponse(userMessage: string): Promise<string> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    if (!this.interviewContext) {
      return '感谢你的回答。让我们继续下一个问题。';
    }

    // 根据职位和面试类型生成针对性的模拟回复
    const jobTitle = this.interviewContext.jobTitle.toLowerCase();
    const interviewType = this.interviewContext.interviewType;
    
    // 智能分析职位类型并生成对应问题
     const getJobSpecificResponses = () => {
       const jobTitleLower = jobTitle.toLowerCase();
       
       // 职位类型分析函数
       const analyzeJobType = () => {
         // 技术类职位关键词
         const techKeywords = ['工程师', 'engineer', '开发', 'developer', '程序员', 'programmer', 'ai', '算法', '前端', 'frontend', '后端', 'backend', '全栈', 'fullstack', '移动端', 'mobile', 'ios', 'android', '测试', 'qa', 'devops', '运维', '架构师', 'architect'];
         
         // 设计类职位关键词
         const designKeywords = ['设计师', 'designer', 'ui', 'ux', '视觉', 'visual', '交互', 'interaction', '用户体验', '平面', 'graphic', '产品设计', '界面设计'];
         
         // 产品类职位关键词
         const productKeywords = ['产品', 'product', 'pm', '产品经理', '产品运营', '需求', '策划'];
         
         // 运营类职位关键词
         const operationKeywords = ['运营', 'operation', '营销', 'marketing', '推广', 'promotion', '增长', 'growth', '用户运营', '内容运营', '活动运营', '社群', '新媒体'];
         
         // 销售类职位关键词
         const salesKeywords = ['销售', 'sales', '商务', 'business', 'bd', '客户', 'account', '渠道', '市场', '业务'];
         
         // 管理类职位关键词
         const managementKeywords = ['经理', 'manager', '总监', 'director', '主管', 'supervisor', '领导', 'lead', '负责人', '团队长'];
         
         // 人力资源类职位关键词
         const hrKeywords = ['人力', 'hr', '招聘', 'recruit', '培训', 'training', '薪酬', '绩效', 'hrbp', '人事'];
         
         // 财务类职位关键词
         const financeKeywords = ['财务', 'finance', '会计', 'accounting', '审计', 'audit', '税务', '成本', '预算', '投资'];
         
         // 数据类职位关键词
         const dataKeywords = ['数据', 'data', '分析师', 'analyst', 'bi', '数据科学', '数据挖掘', '统计'];
         
         // 检查职位类型
         if (techKeywords.some(keyword => jobTitleLower.includes(keyword))) return 'tech';
         if (designKeywords.some(keyword => jobTitleLower.includes(keyword))) return 'design';
         if (productKeywords.some(keyword => jobTitleLower.includes(keyword))) return 'product';
         if (operationKeywords.some(keyword => jobTitleLower.includes(keyword))) return 'operation';
         if (salesKeywords.some(keyword => jobTitleLower.includes(keyword))) return 'sales';
         if (managementKeywords.some(keyword => jobTitleLower.includes(keyword))) return 'management';
         if (hrKeywords.some(keyword => jobTitleLower.includes(keyword))) return 'hr';
         if (financeKeywords.some(keyword => jobTitleLower.includes(keyword))) return 'finance';
         if (dataKeywords.some(keyword => jobTitleLower.includes(keyword))) return 'data';
         
         return 'general';
       };
       
       const jobType = analyzeJobType();
       
       // 根据职位类型生成问题模板
       const questionTemplates = {
         tech: {
           introduction: [
             `很好的自我介绍！我注意到你应聘的是${this.interviewContext.jobTitle}职位。能详细说说你最近参与的一个技术项目吗？特别是你使用的技术栈和遇到的挑战？`,
             `感谢你的介绍。从你的背景来看，你在技术领域有不错的积累。我想了解一下，在你的项目经验中，有没有遇到过技术难题？你是如何解决的？`,
             `听起来你的经验很丰富。我想深入了解一下你的技术能力。你认为自己在${this.interviewContext.jobTitle}这个方向上的核心优势是什么？`
           ],
           technical: [
             `这个技术方案很有意思。那么在${this.interviewContext.jobTitle}的工作中，你是如何保证代码质量和系统稳定性的？`,
             `你的技术思路很清晰。我想问一个具体问题：如果让你设计一个与${this.interviewContext.jobTitle}相关的系统，你会考虑哪些关键因素？`,
             `很好的回答。现在我想了解你的学习能力。技术更新很快，你是如何保持技术敏感度的？最近学习了哪些新技术？`,
             `从技术角度来看，你的基础很扎实。那么在团队协作方面，你是如何与其他技术同事配合的？`
           ]
         },
         design: {
           introduction: [
             `很好的自我介绍！我注意到你应聘的是${this.interviewContext.jobTitle}职位。能详细说说你最近完成的一个设计项目吗？特别是你的设计思路和创作过程？`,
             `感谢你的介绍。从你的背景来看，你在设计领域有不错的积累。我想了解一下，你是如何平衡美观性和实用性的？`,
             `听起来你的经验很丰富。我想深入了解一下你的设计理念。你认为好的设计应该具备哪些特质？`
           ],
           technical: [
             `这个设计理念很有意思。那么在${this.interviewContext.jobTitle}的工作中，你是如何与产品和开发团队协作的？`,
             `你的设计思维很清晰。我想问一个具体问题：如果用户对你的设计方案有不同意见，你会如何处理？`,
             `很好的回答。现在我想了解你的工具使用。你熟悉哪些设计软件？在设计流程中是如何运用的？`,
             `从设计角度来看，你的想法很有创意。那么你是如何保持设计灵感和跟上设计趋势的？`
           ]
         },
         product: {
           introduction: [
             `很好的自我介绍！我注意到你应聘的是${this.interviewContext.jobTitle}职位。能详细说说你最近负责的一个产品项目吗？特别是你的产品思路和规划过程？`,
             `感谢你的介绍。从你的背景来看，你在产品领域有不错的积累。我想了解一下，你是如何进行用户需求分析的？`,
             `听起来你的经验很丰富。我想深入了解一下你的产品方法论。你是如何定义产品成功的？`
           ],
           technical: [
             `这个产品思路很有意思。那么在${this.interviewContext.jobTitle}的工作中，你是如何与技术和设计团队协作的？`,
             `你的产品思维很清晰。我想问一个具体问题：如果产品数据表现不佳，你会如何分析原因并制定改进方案？`,
             `很好的回答。现在我想了解你的市场敏感度。你是如何关注竞品动态和行业趋势的？`,
             `从产品角度来看，你的思路很系统。那么你是如何制定产品路线图和优先级的？`
           ]
         },
         operation: {
           introduction: [
             `很好的自我介绍！我注意到你应聘的是${this.interviewContext.jobTitle}职位。能详细说说你最近执行的一个运营项目吗？特别是你的运营策略和执行过程？`,
             `感谢你的介绍。从你的背景来看，你在运营领域有不错的积累。我想了解一下，你是如何制定运营目标和衡量效果的？`,
             `听起来你的经验很丰富。我想深入了解一下你的运营思路。你认为成功的运营应该具备哪些要素？`
           ],
           technical: [
             `这个运营策略很有意思。那么在${this.interviewContext.jobTitle}的工作中，你是如何进行用户增长和留存的？`,
             `你的运营思维很清晰。我想问一个具体问题：如果运营数据出现下滑，你会如何分析原因并制定应对策略？`,
             `很好的回答。现在我想了解你的数据分析能力。你是如何通过数据来指导运营决策的？`,
             `从运营角度来看，你的方法很实用。那么你是如何与产品、市场等其他部门协作的？`
           ]
         },
         sales: {
           introduction: [
             `很好的自我介绍！我注意到你应聘的是${this.interviewContext.jobTitle}职位。能详细说说你最近完成的一个销售项目吗？特别是你的销售策略和客户沟通过程？`,
             `感谢你的介绍。从你的背景来看，你在销售领域有不错的积累。我想了解一下，你是如何建立和维护客户关系的？`,
             `听起来你的经验很丰富。我想深入了解一下你的销售理念。你认为成功的销售应该具备哪些素质？`
           ],
           technical: [
             `这个销售方法很有意思。那么在${this.interviewContext.jobTitle}的工作中，你是如何处理客户异议和拒绝的？`,
             `你的销售思维很清晰。我想问一个具体问题：如果遇到销售业绩下滑，你会如何分析原因并制定改进计划？`,
             `很好的回答。现在我想了解你的客户管理。你是如何维护老客户并开发新客户的？`,
             `从销售角度来看，你的方法很专业。那么你是如何与市场、产品等其他部门协作的？`
           ]
         },
         management: {
           introduction: [
             `很好的自我介绍！我注意到你应聘的是${this.interviewContext.jobTitle}职位。能详细说说你最近管理的一个团队项目吗？特别是你的管理理念和团队建设过程？`,
             `感谢你的介绍。从你的背景来看，你在管理领域有不错的积累。我想了解一下，你是如何激励团队和提升团队效率的？`,
             `听起来你的经验很丰富。我想深入了解一下你的管理风格。你认为优秀的管理者应该具备哪些特质？`
           ],
           technical: [
             `这个管理方法很有意思。那么在${this.interviewContext.jobTitle}的工作中，你是如何处理团队冲突和绩效问题的？`,
             `你的管理思维很清晰。我想问一个具体问题：如果团队目标没有达成，你会如何分析原因并制定改进措施？`,
             `很好的回答。现在我想了解你的决策能力。你是如何在压力下做出重要决策的？`,
             `从管理角度来看，你的理念很成熟。那么你是如何培养和发展团队成员的？`
           ]
         },
         hr: {
           introduction: [
             `很好的自我介绍！我注意到你应聘的是${this.interviewContext.jobTitle}职位。能详细说说你最近处理的一个人力资源项目吗？特别是你的工作方法和解决方案？`,
             `感谢你的介绍。从你的背景来看，你在人力资源领域有不错的积累。我想了解一下，你是如何平衡员工需求和公司利益的？`,
             `听起来你的经验很丰富。我想深入了解一下你的HR理念。你认为人力资源工作的核心价值是什么？`
           ],
           technical: [
             `这个HR方案很有意思。那么在${this.interviewContext.jobTitle}的工作中，你是如何进行人才招聘和选拔的？`,
             `你的HR思维很清晰。我想问一个具体问题：如果遇到员工关系问题，你会如何处理和调解？`,
             `很好的回答。现在我想了解你的培训发展。你是如何设计和实施员工培训计划的？`,
             `从HR角度来看，你的方法很专业。那么你是如何与各部门协作，支持业务发展的？`
           ]
         },
         finance: {
           introduction: [
             `很好的自我介绍！我注意到你应聘的是${this.interviewContext.jobTitle}职位。能详细说说你最近处理的一个财务项目吗？特别是你的分析方法和解决方案？`,
             `感谢你的介绍。从你的背景来看，你在财务领域有不错的积累。我想了解一下，你是如何进行财务风险控制的？`,
             `听起来你的经验很丰富。我想深入了解一下你的财务理念。你认为财务工作对企业发展的重要性体现在哪里？`
           ],
           technical: [
             `这个财务分析很有意思。那么在${this.interviewContext.jobTitle}的工作中，你是如何进行成本控制和预算管理的？`,
             `你的财务思维很清晰。我想问一个具体问题：如果发现财务异常，你会如何调查和处理？`,
             `很好的回答。现在我想了解你的报表分析。你是如何通过财务数据为业务决策提供支持的？`,
             `从财务角度来看，你的方法很严谨。那么你是如何与业务部门协作，支持公司发展的？`
           ]
         },
         data: {
           introduction: [
             `很好的自我介绍！我注意到你应聘的是${this.interviewContext.jobTitle}职位。能详细说说你最近完成的一个数据分析项目吗？特别是你的分析思路和方法？`,
             `感谢你的介绍。从你的背景来看，你在数据领域有不错的积累。我想了解一下，你是如何从数据中发现业务洞察的？`,
             `听起来你的经验很丰富。我想深入了解一下你的数据思维。你认为数据分析对业务决策的价值体现在哪里？`
           ],
           technical: [
             `这个数据分析很有意思。那么在${this.interviewContext.jobTitle}的工作中，你是如何保证数据质量和准确性的？`,
             `你的数据思维很清晰。我想问一个具体问题：如果数据结果与预期不符，你会如何验证和调整分析方法？`,
             `很好的回答。现在我想了解你的工具使用。你熟悉哪些数据分析工具？在项目中是如何运用的？`,
             `从数据角度来看，你的方法很科学。那么你是如何将分析结果转化为业务建议的？`
           ]
         },
         general: {
           introduction: [
             `很好的自我介绍！我注意到你应聘的是${this.interviewContext.jobTitle}职位。能详细说说你最近参与的一个相关项目吗？特别是你在其中承担的角色和遇到的挑战？`,
             `感谢你的介绍。从你的背景来看，你在这个领域有不错的积累。我想了解一下，在你的工作经验中，有没有遇到过特别有挑战性的问题？你是如何解决的？`,
             `听起来你的经验很丰富。我想深入了解一下你的专业技能。你认为自己在${this.interviewContext.jobTitle}这个方向上的核心优势是什么？`
           ],
           technical: [
             `这个解决方案很有意思。那么在${this.interviewContext.jobTitle}的工作中，你通常是如何与同事配合完成项目的？`,
             `你的思路很清晰。我想问一个更具体的问题：如果让你负责一个重要的${this.interviewContext.jobTitle}相关项目，你会如何规划和执行？`,
             `很好的回答。现在我想了解你的学习能力。这个行业变化很快，你是如何保持技能更新的？`,
             `从专业角度来看，你的基础很扎实。那么在工作中，你是如何保证工作质量和效率的？`
           ]
         }
       };
       
       return questionTemplates[jobType] || questionTemplates.general;
     };

    const jobResponses = getJobSpecificResponses();
    
    // 通用的行为面试和结束语问题
    const commonResponses = {
      behavioral: [
        '你处理这个问题的方式很专业。我想了解一下，在你的工作经历中，有没有遇到过特别有挑战性的deadline？你是如何应对的？',
        '团队协作能力对这个职位很重要。能说说你在团队中通常扮演什么角色？有没有遇到过团队冲突，你是如何解决的？',
        `很好的例子。那么对于这个${jobTitle}职位，你有什么期望？你认为自己能为我们团队带来什么价值？`
      ],
      closing: [
        '感谢你详细的回答，你展现了很强的专业能力和学习态度。现在轮到你了，你有什么问题想要问我关于这个职位或者我们公司的吗？',
        '通过这次交流，我对你的能力有了很好的了解。在结束之前，你还有什么想要补充的吗？或者有什么问题想要了解？',
        '这是一次很愉快的面试。最后，你对这个职位还有什么疑问吗？或者想了解我们团队的工作方式？'
      ]
    };

    let phaseResponses: string[];
    
    if (this.questionCount <= 1) {
      phaseResponses = jobResponses.introduction;
      this.currentPhase = 'introduction';
    } else if (this.questionCount <= 5) {
      phaseResponses = jobResponses.technical;
      this.currentPhase = 'technical';
    } else if (this.questionCount <= 7) {
      phaseResponses = commonResponses.behavioral;
      this.currentPhase = 'behavioral';
    } else {
      phaseResponses = commonResponses.closing;
      this.currentPhase = 'closing';
    }

    return phaseResponses[Math.floor(Math.random() * phaseResponses.length)];
  }

  private async getZhipuAIResponse(): Promise<string> {
    if (!this.apiKey) {
      throw new Error('智谱AI API密钥未配置');
    }

    try {
      // 准备发送给智谱AI的消息格式
      const messages = this.conversationHistory.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const requestBody = {
        model: this.model,
        messages: messages,
        temperature: 0.7,
        max_tokens: 1024,
        stream: false
      };

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`智谱AI API调用失败: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('智谱AI API返回格式异常');
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error('智谱AI API调用错误:', error);
      // 如果API调用失败，回退到模拟响应
      console.log('回退到模拟响应模式');
      return this.getMockResponse('');
    }
  }

  private shouldCompleteInterview(): boolean {
    if (!this.interviewContext) return false;
    
    const duration = this.interviewContext.duration;
    let maxQuestions: number;
    
    // 根据面试时长动态调整问题数量
    if (duration <= 15) {
      maxQuestions = 6;  // 15分钟面试：4-6个问题
    } else if (duration <= 30) {
      maxQuestions = 10; // 30分钟面试：6-10个问题
    } else if (duration <= 45) {
      maxQuestions = 15; // 45分钟面试：10-15个问题
    } else {
      maxQuestions = 20; // 60分钟面试：15-20个问题
    }
    
    // 只有在面试官已经宣布结束且用户确认后才真正结束
    return this.currentPhase === 'completed';
  }
  
  private shouldAnnounceEnd(): boolean {
    if (!this.interviewContext) return false;
    
    const duration = this.interviewContext.duration;
    let maxQuestions: number;
    
    // 根据面试时长动态调整问题数量
    if (duration <= 15) {
      maxQuestions = 6;  // 15分钟面试：4-6个问题
    } else if (duration <= 30) {
      maxQuestions = 10; // 30分钟面试：6-10个问题
    } else if (duration <= 45) {
      maxQuestions = 15; // 45分钟面试：10-15个问题
    } else {
      maxQuestions = 20; // 60分钟面试：15-20个问题
    }
    
    // 当达到问题数量限制时，应该宣布面试结束
     return this.questionCount >= maxQuestions && this.currentPhase !== 'ending' && this.currentPhase !== 'completed';
   }
   
   private generateEndingMessage(): string {
     const endingMessages = [
       '感谢您今天参加我们的面试。通过刚才的交流，我对您的能力和经验有了很好的了解。本次面试到此结束，我们会在近期内给您反馈结果。再次感谢您的时间！',
       '非常感谢您抽出宝贵时间参加今天的面试。您在面试中展现出的专业素养给我留下了深刻印象。本次面试就到这里，我们会尽快处理并通知您面试结果。',
       '今天的面试就到这里结束了。感谢您详细回答了我们的问题，您的表现很不错。我们会综合评估今天的面试情况，并在后续与您联系。谢谢您的参与！',
       '本次面试已经完成，感谢您的积极配合和精彩回答。我们已经收集到了足够的信息来评估您的能力。接下来我们会进行内部讨论，稍后会通知您结果。'
     ];
     
     return endingMessages[Math.floor(Math.random() * endingMessages.length)];
   }
   
   // 新增方法：用户确认结束面试
   completeInterview(): void {
     this.currentPhase = 'completed';
   }

  private determineNextPhase(): string {
    if (this.questionCount <= 1) return 'introduction';
    if (this.questionCount <= 5) return 'technical';
    if (this.questionCount <= 7) return 'behavioral';
    return 'closing';
  }

  private generateSuggestions(): string[] {
    const suggestions = {
      introduction: [
        '详细描述你的项目经验',
        '突出你的核心技能',
        '展示你的学习能力'
      ],
      technical: [
        '用具体例子支撑你的回答',
        '展示你的技术深度',
        '说明你的解决问题思路'
      ],
      behavioral: [
        '分享具体的工作场景',
        '展现你的团队协作能力',
        '体现你的责任心和主动性'
      ],
      closing: [
        '准备一些有深度的问题',
        '展现你对职位的兴趣',
        '总结你的核心优势'
      ]
    };

    return suggestions[this.currentPhase as keyof typeof suggestions] || [];
  }

  getConversationHistory(): AIMessage[] {
    return this.conversationHistory.filter(msg => msg.role !== 'system');
  }

  getCurrentPhase(): string {
    return this.currentPhase;
  }

  getQuestionCount(): number {
    return this.questionCount;
  }

  async generateFeedback(): Promise<{
    overallScore: number;
    dimensionScores: Record<string, number>;
    strengths: string[];
    improvements: string[];
    summary: string;
  }> {
    try {
      if (this.provider === 'zhipu' && this.apiKey) {
        return await this.generateAIFeedback();
      } else {
        return this.generateMockFeedback();
      }
    } catch (error) {
      console.error('生成反馈失败，使用默认反馈:', error);
      return this.generateMockFeedback();
    }
  }

  private async generateAIFeedback(): Promise<{
    overallScore: number;
    dimensionScores: Record<string, number>;
    strengths: string[];
    improvements: string[];
    summary: string;
  }> {
    const conversationText = this.conversationHistory
      .filter(msg => msg.role !== 'system')
      .map(msg => `${msg.role === 'user' ? '候选人' : '面试官'}: ${msg.content}`)
      .join('\n\n');

    const feedbackPrompt = `请作为专业的HR和技术专家，基于以下面试对话内容，生成详细的面试反馈报告。

面试对话:
${conversationText}

请按照以下JSON格式返回评估结果，分数范围为1-10分：
{
  "overallScore": 8.5,
  "dimensionScores": {
    "逻辑清晰度": 8.0,
    "专业契合度": 8.5,
    "表达能力": 8.2,
    "问题理解力": 8.8,
    "压力应对力": 7.5
  },
  "strengths": ["具体的优势点1", "具体的优势点2", "具体的优势点3"],
  "improvements": ["具体的改进建议1", "具体的改进建议2", "具体的改进建议3"],
  "summary": "详细的总结评价"
}

请确保返回的是有效的JSON格式，评分要客观公正，建议要具体可行。`;

    const messages = [
      {
        role: 'system',
        content: '你是一位经验丰富的HR专家和技术面试官，擅长客观评估候选人的面试表现并给出专业建议。'
      },
      {
        role: 'user',
        content: feedbackPrompt
      }
    ];

    const requestBody = {
      model: this.model,
      messages: messages,
      temperature: 0.3,
      max_tokens: 2048,
      stream: false
    };

    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`智谱AI API调用失败: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    try {
      // 清理AI返回内容中的代码块标记
      let cleanResponse = aiResponse.trim();
      
      // 移除可能的代码块标记
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      // 尝试解析清理后的JSON
      const feedback = JSON.parse(cleanResponse);
      
      // 验证和修正数据格式
      return {
        overallScore: Math.max(1, Math.min(10, feedback.overallScore || 7.5)),
        dimensionScores: {
          '逻辑清晰度': Math.max(1, Math.min(10, feedback.dimensionScores?.['逻辑清晰度'] || 7.5)),
          '专业契合度': Math.max(1, Math.min(10, feedback.dimensionScores?.['专业契合度'] || 7.5)),
          '表达能力': Math.max(1, Math.min(10, feedback.dimensionScores?.['表达能力'] || 7.5)),
          '问题理解力': Math.max(1, Math.min(10, feedback.dimensionScores?.['问题理解力'] || 7.5)),
          '压力应对力': Math.max(1, Math.min(10, feedback.dimensionScores?.['压力应对力'] || 7.5))
        },
        strengths: Array.isArray(feedback.strengths) ? feedback.strengths.slice(0, 5) : [
          '技术基础扎实，对核心概念理解深入',
          '表达清晰，逻辑性强',
          '学习能力强，对新技术保持敏感'
        ],
        improvements: Array.isArray(feedback.improvements) ? feedback.improvements.slice(0, 5) : [
          '可以更多地使用具体数据来支撑观点',
          '在描述技术方案时可以更加详细',
          '建议准备一些行业前沿话题'
        ],
        summary: feedback.summary || '整体表现良好，技术能力和沟通能力基本达到岗位要求。'
      };
    } catch (parseError) {
      console.error('解析AI反馈JSON失败:', parseError);
      throw new Error('AI反馈格式解析失败');
    }
  }

  private generateMockFeedback(): {
    overallScore: number;
    dimensionScores: Record<string, number>;
    strengths: string[];
    improvements: string[];
    summary: string;
  } {
    const conversationLength = this.conversationHistory.length;
    const baseScore = Math.min(8.5, 6 + (conversationLength * 0.2));
    
    return {
      overallScore: Math.round(baseScore * 10) / 10,
      dimensionScores: {
        '逻辑清晰度': Math.round((baseScore + Math.random() * 1 - 0.5) * 10) / 10,
        '专业契合度': Math.round((baseScore + Math.random() * 1 - 0.5) * 10) / 10,
        '表达能力': Math.round((baseScore + Math.random() * 1 - 0.5) * 10) / 10,
        '问题理解力': Math.round((baseScore + Math.random() * 1 - 0.5) * 10) / 10,
        '压力应对力': Math.round((baseScore + Math.random() * 1 - 0.5) * 10) / 10
      },
      strengths: [
        '技术基础扎实，对核心概念理解深入',
        '表达清晰，逻辑性强',
        '学习能力强，对新技术保持敏感',
        '团队协作意识良好'
      ],
      improvements: [
        '可以更多地使用具体数据来支撑观点',
        '在描述技术方案时可以更加详细',
        '建议准备一些行业前沿话题',
        '可以提前准备一些有针对性的问题'
      ],
      summary: '整体表现优秀，技术能力和沟通能力都达到了岗位要求。建议在未来的面试中更多地展示具体的项目成果和数据支撑。'
    };
  }
}

export const aiInterviewService = new AIInterviewService();
export default aiInterviewService;