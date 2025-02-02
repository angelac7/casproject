import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar, Brain, TrendingUp, Sun, Moon, Cloud, CloudRain, Wind, Activity, Heart, Coffee, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MoodTracker = () => {
  const [moodData, setMoodData] = useState(() => {
    const saved = localStorage.getItem('moodData');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentMood, setCurrentMood] = useState(5);
  const [moodNote, setMoodNote] = useState('');
  const [activities, setActivities] = useState([]);
  const [weather, setWeather] = useState('sunny');
  const [showInsights, setShowInsights] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState('');
  const [streak, setStreak] = useState(0);

  const moodEmojis = ['😢', '😕', '😐', '🙂', '😊'];
  const moodLabels = ['Very Low', 'Low', 'Neutral', 'Good', 'Excellent'];

  const activityOptions = [
    { icon: <Heart className="h-4 w-4" />, label: 'Exercise' },
    { icon: <Coffee className="h-4 w-4" />, label: 'Social' },
    { icon: <Brain className="h-4 w-4" />, label: 'Learning' },
    { icon: <Music className="h-4 w-4" />, label: 'Creative' },
    { icon: <Moon className="h-4 w-4" />, label: 'Rest' },
  ];

  const weatherOptions = [
    { icon: <Sun className="h-6 w-6" />, value: 'sunny' },
    { icon: <Cloud className="h-6 w-6" />, value: 'cloudy' },
    { icon: <CloudRain className="h-6 w-6" />, value: 'rainy' },
    { icon: <Wind className="h-6 w-6" />, value: 'windy' },
  ];

  useEffect(() => {
    const hour = new Date().getHours();
    setTimeOfDay(
      hour < 12 ? 'morning' :
      hour < 17 ? 'afternoon' :
      'evening'
    );
  }, []);

  useEffect(() => {
    localStorage.setItem('moodData', JSON.stringify(moodData));
    calculateStreak();
  }, [moodData]);

  const calculateStreak = () => {
    let currentStreak = 0;
    const today = new Date().toLocaleDateString();
    
    for (let i = moodData.length - 1; i >= 0; i--) {
      const entryDate = new Date(moodData[i].date);
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - currentStreak);
      
      if (entryDate.toLocaleDateString() === expectedDate.toLocaleDateString()) {
        currentStreak++;
      } else {
        break;
      }
    }
    setStreak(currentStreak);
  };

  const analyzeMoodPatterns = (data) => {
    if (data.length < 3) return null;
    
    const recentMoods = data.slice(-3);
    const averageMood = recentMoods.reduce((acc, curr) => acc + curr.mood, 0) / recentMoods.length;
    const moodTrend = data.slice(-7).map(entry => entry.mood);
    const isImproving = moodTrend.every((mood, i) => i === 0 || mood >= moodTrend[i - 1]);
    const isDeclining = moodTrend.every((mood, i) => i === 0 || mood <= moodTrend[i - 1]);
    
    let analysis = {
      pattern: '',
      strategies: [],
      trend: isImproving ? 'improving' : isDeclining ? 'declining' : 'stable'
    };

    if (averageMood < 3) {
      analysis.pattern = 'Your mood has been lower than usual lately.';
      analysis.strategies = [
        'Try getting some exercise - even a short walk can help',
        'Practice mindfulness meditation for 5-10 minutes',
        'Reach out to a friend or family member for support',
        'Consider scheduling an appointment with a mental health professional',
      ];
    } else if (averageMood > 4) {
      analysis.pattern = 'Your mood has been consistently positive!';
      analysis.strategies = [
        'Keep up your current routine - it\'s working well',
        'Share your positive energy with others who might need support',
        'Document what\'s working well for future reference',
        'Set new goals while maintaining this positive momentum',
      ];
    } else {
      analysis.pattern = 'Your mood has been stable.';
      analysis.strategies = [
        'Maintain your regular self-care routine',
        'Stay connected with your support system',
        'Continue monitoring your mood patterns',
        'Consider trying new activities that bring you joy',
      ];
    }
    
    return analysis;
  };

  const getCorrelations = () => {
    if (moodData.length < 5) return null;

    const weatherCorrelation = {};
    const activityCorrelation = {};

    moodData.forEach(entry => {
      if (entry.weather) {
        weatherCorrelation[entry.weather] = weatherCorrelation[entry.weather] || { sum: 0, count: 0 };
        weatherCorrelation[entry.weather].sum += entry.mood;
        weatherCorrelation[entry.weather].count += 1;
      }

      if (entry.activities) {
        entry.activities.forEach(activity => {
          activityCorrelation[activity] = activityCorrelation[activity] || { sum: 0, count: 0 };
          activityCorrelation[activity].sum += entry.mood;
          activityCorrelation[activity].count += 1;
        });
      }
    });

    return {
      weather: Object.entries(weatherCorrelation).map(([weather, data]) => ({
        factor: weather,
        average: data.sum / data.count
      })),
      activities: Object.entries(activityCorrelation).map(([activity, data]) => ({
        factor: activity,
        average: data.sum / data.count
      }))
    };
  };

  const handleMoodSubmit = () => {
    const newMoodEntry = {
      date: new Date().toLocaleDateString(),
      mood: currentMood,
      note: moodNote,
      weather,
      activities,
      timeOfDay,
      timestamp: new Date().getTime()
    };
    setMoodData([...moodData, newMoodEntry]);
    setMoodNote('');
    setActivities([]);
    setShowInsights(true);
  };

  const toggleActivity = (activity) => {
    setActivities(prev => 
      prev.includes(activity)
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const analysis = analyzeMoodPatterns(moodData);
  const correlations = getCorrelations();

  return (
    <div className="container mx-auto p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Track Today's Mood
              {streak > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm"
                >
                  🔥 {streak} day streak!
                </motion.span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center gap-4 mb-4">
              {moodEmojis.map((emoji, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentMood(index + 1)}
                  className={`text-4xl p-2 rounded-full transition-colors ${
                    currentMood === index + 1 ? 'bg-purple-100' : ''
                  }`}
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-4"
            >
              {moodLabels[currentMood - 1]}
            </motion.div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Weather Today:</h4>
              <div className="flex justify-center gap-4">
                {weatherOptions.map((option) => (
                  <motion.button
                    key={option.value}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setWeather(option.value)}
                    className={`p-2 rounded-full ${
                      weather === option.value ? 'bg-purple-100' : ''
                    }`}
                  >
                    {option.icon}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold mb-2">Activities:</h4>
              <div className="flex flex-wrap gap-2">
                {activityOptions.map((activity) => (
                  <motion.button
                    key={activity.label}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleActivity(activity.label)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                      activities.includes(activity.label)
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {activity.icon}
                    {activity.label}
                  </motion.button>
                ))}
              </div>
            </div>

            <textarea
              value={moodNote}
              onChange={(e) => setMoodNote(e.target.value)}
              placeholder="Add a note about your mood (optional)"
              className="w-full p-2 border rounded-md mb-4"
              rows="3"
            />
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleMoodSubmit}
              className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition-colors"
            >
              Save Mood
            </motion.button>
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
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <AnimatePresence>
          {showInsights && analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-6 w-6" />
                    AI Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Pattern Analysis</h3>
                      <p className="mb-4">{analysis.pattern}</p>
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Suggested Strategies:</h4>
                        <ul className="space-y-2">
                          {analysis.strategies.map((strategy, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center gap-2"
                            >
                              <Activity className="h-4 w-4 text-purple-600" />
                              {strategy}
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {correlations && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Mood Correlations</h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Weather Impact:</h4>
                            <div className="h-32">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={correlations.weather}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="factor" />
                                  <YAxis domain={[1, 5]} />
                                  <Tooltip />
                                  <Bar dataKey="average" fill="#8884d8" />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">Activity Impact:</h4>
                            <div className="h-32">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={correlations.activities}>
                                  <CartesianGrid strokeDasharray="3 3" />
                                  <XAxis dataKey="factor" />
                                  <YAxis domain={[1, 5]} />
                                  <Tooltip />
                                  <Bar dataKey="average" fill="#82ca9d" />
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default MoodTracker;