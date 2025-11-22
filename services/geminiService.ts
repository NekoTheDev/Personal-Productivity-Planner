import { GoogleGenAI } from "@google/genai";
import { Habit } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMotivationalFeedback = async (
  habits: Habit[],
  last7DaysStats: { date: string; completedCount: number }[]
): Promise<string> => {
  
  if (habits.length === 0) {
    return "Hãy bắt đầu bằng việc thêm một thói quen nhỏ. Hành trình vạn dặm bắt đầu từ một bước chân!";
  }

  // Prepare data for the prompt
  const habitSummary = habits.map(h => {
    const completionsThisWeek = h.completedDates.filter(date => {
        const d = new Date(date);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - d.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return diffDays <= 7;
    }).length;
    return `- ${h.name} (${h.frequency === 'daily' ? 'Hàng ngày' : 'Hàng tuần'}): Hoàn thành ${completionsThisWeek} lần trong 7 ngày qua.`;
  }).join('\n');

  const totalCompletions = last7DaysStats.reduce((acc, curr) => acc + curr.completedCount, 0);

  const prompt = `
    Bạn là một huấn luyện viên cuộc sống (Life Coach) cực kỳ tích cực, nhiệt huyết và biết truyền cảm hứng bằng Tiếng Việt.
    Dưới đây là dữ liệu thói quen của người dùng trong tuần qua:
    
    ${habitSummary}
    
    Tổng số lần hoàn thành nhiệm vụ trong tuần: ${totalCompletions}.

    Nhiệm vụ của bạn:
    1. Viết một đoạn tổng kết ngắn gọn (khoảng 100 từ).
    2. Khen ngợi người dùng về những gì họ đã làm được.
    3. Đưa ra 2 gợi ý cụ thể để cải thiện hoặc duy trì động lực cho tuần tới.
    
    Giọng văn: Thân thiện, ấm áp, dùng emoji, tuyệt đối không phán xét. Hãy xưng hô là "mình" và gọi người dùng là "bạn".
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Không thể tải lời khuyên lúc này, nhưng hãy cứ vững bước nhé!";
  } catch (error) {
    console.error("Error generating feedback:", error);
    return "Hệ thống đang bận rộn một chút, nhưng sự nỗ lực của bạn vẫn luôn được ghi nhận!";
  }
};