import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  AlertTriangle, 
  Star, 
  TrendingUp, 
  DollarSign,
  Clock,
  Users,
  Database
} from "lucide-react";

interface RecommendationSummaryProps {
  recommendation: any;
}

export const RecommendationSummary = ({ recommendation }: RecommendationSummaryProps) => {
  const primary = recommendation.primary;
  const alternatives = recommendation.alternatives;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent Match";
    if (score >= 60) return "Good Match";
    return "Fair Match";
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" />
          Recommendation Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary Recommendation */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Database className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{primary.database.name}</h3>
                <p className="text-sm text-muted-foreground">{primary.database.category} • {primary.database.type}</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${getScoreColor(primary.score)}`}>
                {primary.score}%
              </div>
              <div className="text-xs text-muted-foreground">
                {getScoreLabel(primary.score)}
              </div>
            </div>
          </div>

          <Progress value={primary.score} className="h-2" />

          {/* Reasons */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Why it's perfect for you
            </h4>
            <div className="space-y-1">
              {primary.reasons.slice(0, 3).map((reason, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Warnings */}
          {primary.warnings.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                Things to consider
              </h4>
              <div className="space-y-1">
                {primary.warnings.slice(0, 2).map((warning, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{warning}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="font-medium">Cost:</span>
                <Badge variant="outline" className="text-xs">
                  {recommendation.costs.operational}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Timeline:</span>
                <span className="text-xs text-muted-foreground">
                  {recommendation.implementation.timeline}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Scaling:</span>
                <Badge variant="outline" className="text-xs">
                  {recommendation.costs.scaling}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-orange-600" />
                <span className="font-medium">Complexity:</span>
                <Badge variant="outline" className="text-xs">
                  {recommendation.costs.development}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Alternative Options */}
        {alternatives.length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-medium text-sm">Alternative Options</h4>
            <div className="space-y-2">
              {alternatives.slice(0, 2).map((alt, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                      <Database className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{alt.database.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {alt.reasons[0] || 'Good alternative choice'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getScoreColor(alt.score)}`}>
                      {alt.score}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Use Case Match */}
        {primary.useCaseMatch && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium">Perfect for:</span>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {primary.useCaseMatch}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};