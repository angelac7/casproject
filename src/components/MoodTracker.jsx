import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Brain, TrendingUp } from 'lucide-react';

const MoodTracker = () => {
  const [moodData, setMoodData] = useState([]);
  const [currentMood, setCurrentMood] = useState(5);
  const [moodNote, setMoodNote] = useState('');

  const moodEmojis = ['😢', '😕', '😐', '🙂', '😊'];
  const moodLabels = ['Very Low', 'Low', 'Neutral', 'Good', 'Excellent'];

  // Simulated AI analysis (in a real app, this would call an AI service)
  const analyzeMoodPatterns = (data) => {
    if (data.length < 3) return null;
    
    const recentMoods = data.slice(-3);
    const averageMood = recentMoods.reduce((acc, curr) => acc + curr.mood, 0) / recentMoods.length;
    
    if (averageMood < 3) {
      return {
        pattern: 'Your mood has been lower than usual lately.',
        strategies: [
          'Try getting some exercise',
          'Practice mindfulness meditation',
          'Reach out to a friend or family member',
        ]
      };
    } else if (averageMood > 4) {
      return {
        pattern: 'Your mood has been consistently positive!',
        strategies: [
          'Keep up your current routine',
          'Share your positive energy with others',
          'Document what\'s working well for you',
        ]
      };
    }
    return {
      pattern: 'Your mood has been stable.',
      strategies: [
        'Maintain your regular self-care routine',
        'Stay connected with your support system',
        'Continue monitoring your mood',
      ]
    };
  };

  const handleMoodSubmit = () => {
    const newMoodEntry = {
      date: new Date().toLocaleDateString(),
      mood: currentMood,
      note: moodNote,
    };
    setMoodData([...moodData, newMoodEntry]);
    setMoodNote('');
  };

  const analysis = analyzeMoodPatterns(moodData);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Track Today's Mood
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-4 mb-4">
              {moodEmojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMood(index + 1)}
                  className={`text-4xl p-2 rounded-full transition-transform ${
                    currentMood === index + 1 ? 'scale-125 bg-purple-100' : ''
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            <div className="text-center mb-4">
              {moodLabels[currentMood - 1]}
            </div>
            <textarea
              value={moodNote}
              onChange={(e) => setMoodNote(e.target.value)}
              placeholder="Add a note about your mood (optional)"
              className="w-full p-2 border rounded-md mb-4"
              rows="3"
            />
            <button
              onClick={handleMoodSubmit}
              className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors"
            >
              Save Mood
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              Mood History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[1, 5]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="mood" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {analysis && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-lg">{analysis.pattern}</p>
              <h4 className="font-semibold mb-2">Suggested Strategies:</h4>
              <ul className="list-disc pl-6">
                {analysis.strategies.map((strategy, index) => (
                  <li key={index} className="mb-2">{strategy}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MoodTracker;