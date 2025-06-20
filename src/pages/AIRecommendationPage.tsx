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
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-semibold">AI Database Consultant</h1>
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

      {/* Main Content - Bolt.new style layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Fixed Chat Interface */}
        <div className="w-96 border-r bg-background flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <span className="font-medium">AI Consultant</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Get personalized database recommendations
            </p>
          </div>

          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.type === 'ai' && (
                    <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white ml-auto'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">
                      {message.content}
                    </div>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>

                  {message.type === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="bg-muted rounded-lg px-3 py-2">
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

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your project..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputMessage.trim() || isTyping}
                size="icon"
                className="shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel - Response and Visualizations */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Requirements Header */}
          <div className="p-6 border-b bg-muted/30">
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Detected Requirements
            </h2>
            <div className="flex flex-wrap gap-2">
              {userRequirements.projectType && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  {userRequirements.projectType}
                </Badge>
              )}
              {userRequirements.expectedLoad && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  {userRequirements.expectedLoad} load
                </Badge>
              )}
              {userRequirements.budget && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Database className="h-3 w-3" />
                  {userRequirements.budget} budget
                </Badge>
              )}
              {userRequirements.team && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {userRequirements.team} team
                </Badge>
              )}
              {userRequirements.performance && userRequirements.performance.length > 0 && (
                userRequirements.performance.map((perf, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    {perf}
                  </Badge>
                ))
              )}
              {Object.keys(userRequirements).length === 0 && (
                <span className="text-sm text-muted-foreground">
                  Start chatting to help me understand your requirements...
                </span>
              )}
            </div>
          </div>

          {/* Main Content Area */}
          <ScrollArea className="flex-1">
            <div className="p-6 space-y-6">
              {!currentRecommendation ? (
                <div className="flex items-center justify-center h-64 text-center">
                  <div>
                    <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Ready to help!</h3>
                    <p className="text-muted-foreground max-w-md">
                      Tell me about your project in the chat, and I'll provide personalized database recommendations with architecture diagrams.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Recommendation Summary */}
                  <RecommendationSummary recommendation={currentRecommendation} />
                  
                  {/* Architecture Diagram */}
                  <DatabaseArchitectureDiagram 
                    recommendation={currentRecommendation}
                    requirements={userRequirements}
                  />

                  {/* Implementation Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        Implementation Plan
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-3">Implementation Steps</h4>
                          <ol className="space-y-2">
                            {currentRecommendation.implementation.steps.map((step, index) => (
                              <li key={index} className="flex gap-3 text-sm">
                                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-medium">
                                  {index + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-3">Key Considerations</h4>
                          <ul className="space-y-2">
                            {currentRecommendation.implementation.considerations.map((consideration, index) => (
                              <li key={index} className="flex gap-2 text-sm">
                                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span>{consideration}</span>
                              </li>
                            ))}
                          </ul>
                          
                          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                            <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                              Estimated Timeline
                            </div>
                            <div className="text-sm text-blue-700 dark:text-blue-300">
                              {currentRecommendation.implementation.timeline}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Cost Breakdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        Cost Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                          <div className="text-sm font-medium text-green-800 dark:text-green-200">
                            Development
                          </div>
                          <div className="text-lg font-semibold text-green-700 dark:text-green-300">
                            {currentRecommendation.costs.development}
                          </div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                          <div className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            Operational
                          </div>
                          <div className="text-lg font-semibold text-blue-700 dark:text-blue-300">
                            {currentRecommendation.costs.operational}
                          </div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                          <div className="text-sm font-medium text-purple-800 dark:text-purple-200">
                            Scaling
                          </div>
                          <div className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                            {currentRecommendation.costs.scaling}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendationPage;