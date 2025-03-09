import axios from 'axios';
import md5 from 'md5';
import dev from '../config/development';
import pro from '../config/production';

export class TranslationService {
  API_URL = ''
  API_KEY = ''
  API_SECRET = ''

  constructor() {
    const config = process.env.NODE_ENV === 'production' ? pro : dev;
    this.API_URL = dev.API_URL;
    this.API_KEY = dev.API_KEY;
    this.API_SECRET = dev.API_SECRET;
    console.log(process.env.NODE_ENV , config)
  }
  
  async translate(text: string, sourceLang: string, targetLang: string): Promise<string> {
    try {
      // 实际项目中，这里应该调用真实的翻译API
      // 这里使用模拟数据进行演示
      // if (process.env.NODE_ENV === 'development') {
      //   // 模拟翻译结果
      //   return this.mockTranslate(text, sourceLang, targetLang);
      // }

      const salt = Math.random().toString(36).slice(2)
      const response = await axios.get(this.API_URL, {
        params: {
          q: text,    //	string	是	请求翻译query	UTF-8编码
          from: sourceLang,   //	string	是	翻译源语言	可设置为auto
          to: targetLang,   //	string	是	翻译目标语言	不可设置为auto
          appid: this.API_KEY,    //	string	是	APPID	可在管理控制台查看
          salt,   //	string	是	随机数	可为字母或数字的字符串
          sign: md5(`${this.API_KEY}${text}${salt}${this.API_SECRET}`),   //	string	是	签名	appid+q+salt+密钥的MD5值
        },
        withCredentials: true,
      });
      console.log('response', response)
      return '===';
    } catch (error) {
      console.error('Translation error:', error);
      throw new Error('翻译失败，请稍后重试');
    }
  }
  
  // 模拟翻译功能，仅用于开发测试
  private mockTranslate(text: string, sourceLang: string, targetLang: string): string {
    // 简单的模拟翻译，实际项目中应删除
    if (sourceLang === 'zh-CN' && targetLang === 'en-US') {
      const mockDict: Record<string, string> = {
        '你好': 'Hello',
        '早上好': 'Good morning',
        '下午好': 'Good afternoon',
        '晚上好': 'Good evening',
        '谢谢': 'Thank you',
        '再见': 'Goodbye',
        '我是': 'I am',
        '我们': 'We',
        '今天': 'Today',
        '明天': 'Tomorrow',
        '昨天': 'Yesterday'
      };
      
      // 简单替换已知词汇
      let result = text;
      Object.keys(mockDict).forEach(key => {
        result = result.replace(new RegExp(key, 'g'), mockDict[key]);
      });
      
      // 如果没有匹配到任何词汇，添加前缀表示这是翻译结果
      if (result === text) {
        return `[EN] ${text}`;
      }
      
      return result;
    } else if (sourceLang === 'en-US' && targetLang === 'zh-CN') {
      const mockDict: Record<string, string> = {
        'Hello': '你好',
        'Good morning': '早上好',
        'Good afternoon': '下午好',
        'Good evening': '晚上好',
        'Thank you': '谢谢',
        'Goodbye': '再见',
        'I am': '我是',
        'We': '我们',
        'Today': '今天',
        'Tomorrow': '明天',
        'Yesterday': '昨天'
      };
      
      // 简单替换已知词汇
      let result = text;
      Object.keys(mockDict).forEach(key => {
        result = result.replace(new RegExp(key, 'gi'), mockDict[key]);
      });
      
      // 如果没有匹配到任何词汇，添加前缀表示这是翻译结果
      if (result === text) {
        return `[中文] ${text}`;
      }
      
      return result;
    }
    
    // 对于其他语言组合，简单返回带标记的原文
    return `[${targetLang}] ${text}`;
  }
}

export default new TranslationService();