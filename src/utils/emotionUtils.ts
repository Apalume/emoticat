export const getEmotionEmoji = (emotion: string): string => {
    const emotionEmojiMap: { [key: string]: string } = {
      "Content": "😺",
      "Happy": "😸",
      "Curious": "🐱",
      "Affectionate": "😽",
      "Scared": "🙀",
      "Aggressive": "😾",
      "Annoyed": "😼",
      "Anxious": "😿",
      "Sad": "😿",
      "Bored": "🐈",
      "Sleepy": "😴"
    };
    return emotionEmojiMap[emotion] || '🐱';
  };