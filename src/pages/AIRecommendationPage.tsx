import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Database, Zap, Target, Settings, Download, RefreshCw } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DatabaseRecommendationEngine } from "@/services/aiRecommendationService";
import { DatabaseArchitectureDiagram } from "@/components/DatabaseArchitectureDiagram";
import { RecommendationSummary } from "@/components/RecommendationSummary";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  recommendations?: any;
}

interface UserRequirements {
  projectType?: string;
  expectedLoad?: string;
  dataSize?: string;
  budget?: string;
  team?: string;
  performance?: string[];
  features?: string[];
  scalability?: string;
  consistency?: string;
}

const AIRecommendationPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "👋 Hi! I'm your AI database consultant. I'll help you find the perfect database solution for your project.\n\nTo get started, tell me about your project:\n• What type of application are you building?\n• What's your expected user load?\n• Do you have any specific requirements?",
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [userRequirements, setUserRequirements] = useState<UserRequirements>({});
  const [currentRecommendation, setCurrentRecommendation] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recommendationEngine = new DatabaseRecommendationEngine();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI processing delay
    setTimeout(async () => {
      const aiResponse = await processUserInput(inputMessage);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const processUserInput = async (input: string): Promise<Message> => {
    // Extract requirements from user input
    const extractedRequirements = extractRequirements(input);
    const updatedRequirements = { ...userRequirements, ...extractedRequirements };
    setUserRequirements(updatedRequirements);

    // Generate AI response based on current requirements
    const response = await recommendationEngine.generateResponse(input, updatedRequirements);
    
    // If we have enough information, generate recommendations
    let recommendations = null;
    if (hasEnoughInformation(updatedRequirements)) {
      recommendations = await recommendationEngine.generateRecommendations(updatedRequirements);
      setCurrentRecommendation(recommendations);
    }

    return {
      id: Date.now().toString(),
      type: 'ai',
      content: response,
      timestamp: new Date(),
      recommendations,
    };
  };

  const extractRequirements = (input: string): Partial<UserRequirements> => {
    const requirements: Partial<UserRequirements> = {};
    const lowerInput = input.toLowerCase();

    // Project type detection
    if (lowerInput.includes('web app') || lowerInput.includes('website')) {
      requirements.projectType = 'web application';
    } else if (lowerInput.includes('mobile') || lowerInput.includes('app')) {
      requirements.projectType = 'mobile application';
    } else if (lowerInput.includes('analytics') || lowerInput.includes('dashboard')) {
      requirements.projectType = 'analytics platform';
    } else if (lowerInput.includes('iot') || lowerInput.includes('sensor')) {
      requirements.projectType = 'IoT application';
    } else if (lowerInput.includes('ecommerce') || lowerInput.includes('e-commerce')) {
      requirements.projectType = 'e-commerce platform';
    }

    // Load detection
    if (lowerInput.includes('high load') || lowerInput.includes('millions')) {
      requirements.expectedLoad = 'high';
    } else if (lowerInput.includes('medium') || lowerInput.includes('thousands')) {
      requirements.expectedLoad = 'medium';
    } else if (lowerInput.includes('low') || lowerInput.includes('small')) {
      requirements.expectedLoad = 'low';
    }

    // Budget detection
    if (lowerInput.includes('budget') || lowerInput.includes('cost') || lowerInput.includes('cheap')) {
      requirements.budget = 'limited';
    } else if (lowerInput.includes('enterprise') || lowerInput.includes('unlimited budget')) {
      requirements.budget = 'enterprise';
    }

    // Team size detection
    if (lowerInput.includes('solo') || lowerInput.includes('one person')) {
      requirements.team = 'solo';
    } else if (lowerInput.includes('small team') || lowerInput.includes('startup')) {
      requirements.team = 'small';
    } else if (lowerInput.includes('large team') || lowerInput.includes('enterprise')) {
      requirements.team = 'large';
    }

    // Performance requirements
    const performanceFeatures = [];
    if (lowerInput.includes('fast') || lowerInput.includes('performance')) {
      performanceFeatures.push('high performance');
    }
    if (lowerInput.includes('real-time') || lowerInput.includes('realtime')) {
      performanceFeatures.push('real-time');
    }
    if (lowerInput.includes('scale') || lowerInput.includes('scaling')) {
      performanceFeatures.push('scalability');
    }
    if (performanceFeatures.length > 0) {
      requirements.performance = performanceFeatures;
    }

    return requirements;
  };

  const hasEnoughInformation = (requirements: UserRequirements): boolean => {
    return !!(requirements.projectType && requirements.expectedLoad);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const exportRecommendation = () => {
    if (!currentRecommendation) return;

    const markdown = recommendationEngine.exportToMarkdown(currentRecommendation, userRequirements);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'database-recommendation.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const resetConversation = () => {
    setMessages([
      {
        id: '1',
        type: 'ai',
        content: "👋 Hi! I'm your AI database consultant. I'll help you find the perfect database solution for your project.\n\nTo get started, tell me about your project:\n• What type of application are you building?\n• What's your expected user load?\n• Do you have any specific requirements?",
        timestamp: new Date(),
      }
    ]);
    setUserRequirements({});
    setCurrentRecommendation(null);
  };

  return (
    <Layout>
      <div className="pt-16 pb-8 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container max-w-7xl px-4">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  <Bot className="h-8 w-8 text-blue-600" />
                  AI Database Consultant
                </h1>
                <p className="text-muted-foreground mt-2">
                  Get personalized database recommendations based on your project requirements
                </p>
              </div>
              <div className="flex gap-2">
                {currentRecommendation && (
                  <Button onClick={exportRecommendation} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                )}
                <Button onClick={resetConversation} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
            {/* Chat Interface - Left Side */}
            <Card className="flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  AI Consultant Chat
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <ScrollArea className="flex-1 px-6">
                  <div className="space-y-4 pb-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          message.type === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {message.type === 'ai' && (
                          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                            <Bot className="h-4 w-4 text-blue-600" />
                          </div>
                        )}
                        
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            message.type === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-muted'
                          }`}
                        >
                          <div className="whitespace-pre-wrap text-sm">
                            {message.content}
                          </div>
                          <div className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>

                        {message.type === 'user' && (
                          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                            <User className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex gap-3 justify-start">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="bg-muted rounded-lg px-4 py-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div ref={messagesEndRef} />
                </ScrollArea>

                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Describe your project requirements..."
                      className="flex-1"
                      disabled={isTyping}
                    />
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={!inputMessage.trim() || isTyping}
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Visualization Panel - Right Side */}
            <div className="space-y-6">
              {/* Current Requirements */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Detected Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {userRequirements.projectType && (
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">Project Type:</span>
                        <Badge variant="outline">{userRequirements.projectType}</Badge>
                      </div>
                    )}
                    {userRequirements.expectedLoad && (
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium">Expected Load:</span>
                        <Badge variant="outline">{userRequirements.expectedLoad}</Badge>
                      </div>
                    )}
                    {userRequirements.budget && (
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">Budget:</span>
                        <Badge variant="outline">{userRequirements.budget}</Badge>
                      </div>
                    )}
                    {userRequirements.team && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-medium">Team Size:</span>
                        <Badge variant="outline">{userRequirements.team}</Badge>
                      </div>
                    )}
                    {userRequirements.performance && userRequirements.performance.length > 0 && (
                      <div className="flex items-start gap-2">
                        <Zap className="h-4 w-4 text-red-600 mt-0.5" />
                        <span className="text-sm font-medium">Performance:</span>
                        <div className="flex flex-wrap gap-1">
                          {userRequirements.performance.map((perf, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {perf}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {Object.keys(userRequirements).length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Start chatting to help me understand your requirements...
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recommendation Summary */}
              {currentRecommendation && (
                <RecommendationSummary recommendation={currentRecommendation} />
              )}

              {/* Architecture Diagram */}
              {currentRecommendation && (
                <DatabaseArchitectureDiagram 
                  recommendation={currentRecommendation}
                  requirements={userRequirements}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AIRecommendationPage;