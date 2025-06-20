import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Star, 
  MessageSquare, 
  Send, 
  CheckCircle, 
  XCircle, 
  ExternalLink, 
  Share2, 
  Edit, 
  Flag,
  Github
} from "lucide-react";
import { getDatabaseBySlug } from "@/services/databaseService";
import { 
  getUserProfile,
  getCommentsForDatabase,
  addComment,
  getRatingForDatabase,
  addOrUpdateRating
} from "@/services/userInteractionService";
import type { DatabaseType } from "@/types/database";
import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { GitHubUsernamePrompt } from "@/components/GitHubUsernamePrompt";

// Component for user interactions (ratings and comments)
const DatabaseInteractions = ({ databaseSlug }) => {
  const { toast } = useToast();
  const [userRating, setUserRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [user, setUser] = useState(null);
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUser(profile);
      } catch (err) {
        console.log("No GitHub username set");
      }
    };

    const fetchComments = async () => {
      setIsLoadingComments(true);
      try {
        const result = await getCommentsForDatabase(databaseSlug);
        setComments(result);
      } catch (err) {
        console.error("Error fetching comments", err);
      } finally {
        setIsLoadingComments(false);
      }
    };

    const fetchRating = async () => {
      try {
        const result = await getRatingForDatabase(databaseSlug);
        setAverageRating(result.averageRating);
        setRatingCount(result.totalRatings);
      } catch (err) {
        console.error("Error fetching rating", err);
      }
    };

    fetchUserProfile();
    fetchComments();
    fetchRating();
  }, [databaseSlug]);

  const handleRatingChange = async (rating) => {
    if (!user) {
      setShowUsernamePrompt(true);
      return;
    }

    try {
      await addOrUpdateRating(databaseSlug, rating);
      setUserRating(rating);
      const { averageRating, totalRatings } = await getRatingForDatabase(databaseSlug);
      setAverageRating(averageRating);
      setRatingCount(totalRatings);
      toast({
        description: "Rating submitted successfully!",
        duration: 2000,
      });
    } catch (err) {
      console.error("Error updating rating", err);
      toast({
        variant: "destructive",
        description: err.message || "Failed to submit rating. Please try again.",
        duration: 3000,
      });
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      setShowUsernamePrompt(true);
      return;
    }

    if (!commentText.trim()) return;

    setIsSubmitting(true);
    try {
      const newComment = await addComment(databaseSlug, commentText);
      setComments([newComment, ...comments]);
      setCommentText("");
      toast({
        description: "Comment posted successfully!",
        duration: 2000,
      });
    } catch (err) {
      console.error("Error posting comment", err);
      toast({
        variant: "destructive",
        description: err.message || "Failed to post comment. Please try again.",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUsernameSet = async (username) => {
    const profile = await getUserProfile();
    setUser(profile);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <>
      {/* Rating Section */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Community Ratings</CardTitle>
            <div className="flex items-center bg-muted rounded-md px-3 py-1">
              <span className="text-2xl font-bold text-yellow-500 mr-1">{averageRating.toFixed(1)}</span>
              <div className="flex flex-col">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-3 w-3 ${
                        star <= Math.round(averageRating)
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {ratingCount} {ratingCount === 1 ? "rating" : "ratings"}
                </span>
              </div>
            </div>
          </div>
          <CardDescription>
            Share your experience with this database (GitHub username required)
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium mb-2">Your rating:</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingChange(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-db-primary"
                    aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                  >
                    <Star
                      className={`h-8 w-8 transition-all ${
                        star <= (hoveredRating || userRating)
                          ? "text-yellow-500 fill-yellow-500 scale-110"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {userRating > 0 && (
                <p className="text-sm text-muted-foreground mt-2">
                  You rated this database {userRating} {userRating === 1 ? "star" : "stars"}
                </p>
              )}
              {!user && (
                <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                  <Github className="h-4 w-4" />
                  Set your GitHub username to rate and comment
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Community Comments</CardTitle>
            <span className="text-sm rounded-full bg-muted px-2 py-1">
              {comments.length} {comments.length === 1 ? "comment" : "comments"}
            </span>
          </div>
          <CardDescription>
            All comments are stored in the repository and publicly visible
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Comment Form */}
          <form onSubmit={handleSubmitComment} className="mb-6">
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 hidden sm:block">
                <AvatarFallback>
                  {user ? user.username.charAt(0).toUpperCase() : <Github className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              <div className="relative flex-1">
                <Textarea
                  placeholder={user ? "Share your thoughts on this database..." : "Set your GitHub username to comment"}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="pr-12 resize-none"
                  rows={2}
                  disabled={!user}
                />
                <Button 
                  size="sm" 
                  className="absolute right-2 bottom-2" 
                  type="submit" 
                  disabled={isSubmitting || !commentText.trim() || !user}
                  variant="ghost"
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send</span>
                </Button>
              </div>
            </div>
            {!user && (
              <div className="mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowUsernamePrompt(true)}
                  className="flex items-center gap-2"
                >
                  <Github className="h-4 w-4" />
                  Set GitHub Username
                </Button>
              </div>
            )}
          </form>

          <Separator className="my-6" />

          {/* Comments List */}
          {isLoadingComments ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 pb-4">
                  <div className="h-10 w-10 rounded-full bg-muted"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-24 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-full mb-1"></div>
                    <div className="h-3 bg-muted rounded w-4/5"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length > 0 ? (
            <div className="space-y-6">
              {comments.map((comment, index) => (
                <div key={index} className="group">
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{comment.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <h4 className="font-medium text-sm flex items-center gap-1">
                          <Github className="h-3 w-3" />
                          {comment.username}
                        </h4>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(comment.date)}
                        </span>
                      </div>
                      <p className="mt-1 text-sm whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  </div>
                  {index < comments.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <h3 className="font-medium text-lg">No comments yet</h3>
              <p className="text-muted-foreground mt-1">Be the first to share your thoughts!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* GitHub Username Prompt */}
      <GitHubUsernamePrompt
        open={showUsernamePrompt}
        onOpenChange={setShowUsernamePrompt}
        onUsernameSet={handleUsernameSet}
      />
    </>
  );
};

// Main Database Detail Page Component
const DatabaseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [database, setDatabase] = useState<DatabaseType | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDb = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const db = await getDatabaseBySlug(slug);
        if (!db) setError("Database not found");
        setDatabase(db);
      } catch (err) {
        setError("Error fetching database details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDb();
  }, [slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      description: "Link copied to clipboard!",
      duration: 2000,
    });
  };

  const handleSharing = () => {
    if(navigator.share) {
      navigator.share({
        title: database?.name,
        text: `Check out this database: ${database?.name}`,
        url: window.location.href,
      }).catch((err) => {
        console.error("Error sharing:", err);
        handleCopyLink();
      });
    } else {
      handleCopyLink();
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="pt-24 pb-16 container px-4 max-w-6xl">
          <DatabaseDetailSkeleton />
        </div>
      </Layout>
    );
  }

  if (error || !database) {
    return (
      <Layout>
        <div className="pt-24 pb-16 container px-4 max-w-6xl text-center">
          <h1 className="text-4xl font-bold mb-8">{error || "Database Not Found"}</h1>
          <p className="mb-8">
            The database you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/databases">
            <Button>View All Databases</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="relative pt-24 pb-16 min-h-[60vh]">
        {/* Gradient background */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-db-primary/20 to-db-secondary/5 blur-3xl opacity-30 -z-10" 
          aria-hidden="true" 
        />
        
        <div className="container px-4 max-w-6xl">
          {/* Header section */}
          <Card className="mb-8 overflow-hidden border-border/30">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Logo/Initial */}
                <div className="flex-shrink-0">
                  {database.logoUrl ? (
                    <img 
                      src={database.logoUrl} 
                      alt={`${database.name} logo`} 
                      className="w-16 h-16 rounded-lg object-contain"
                    />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center rounded-lg bg-muted text-2xl font-bold">
                      {database.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Title and badges */}
                <div className="flex-grow">
                  <h1 className="text-3xl md:text-4xl font-bold mb-3">{database.name}</h1>
                  {database.tagline && (
                    <p className="text-lg text-muted-foreground mb-3">{database.tagline}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-db-primary text-db-primary">
                      {database.category}
                    </Badge>
                    <Badge variant="outline" className="border-muted-foreground text-muted-foreground">
                      {database.type}
                    </Badge>
                    <Badge variant="outline" className="border-muted-foreground text-muted-foreground">
                      {database.license}
                    </Badge>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 mt-4 md:mt-0 w-full md:w-auto">
                  {database.websiteUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={database.websiteUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Website
                      </a>
                    </Button>
                  )}
                  {database.documentationUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={database.documentationUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Docs
                      </a>
                    </Button>
                  )}
                  {database.githubUrl && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={database.githubUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        GitHub
                      </a>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" onClick={handleSharing}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Description Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{database.description}</p>
                  {database.keyStrength && (
                    <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">Key Strength</h4>
                      <p className="text-green-700 dark:text-green-300 text-sm">{database.keyStrength}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Features Card */}
              {database.features && database.features.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {database.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Use Cases Card */}
              {database.useCases && database.useCases.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Common Use Cases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {database.useCases.map((useCase, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{useCase}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Pros and Cons Card */}
              {database.pros && database.cons && (database.pros.length > 0 || database.cons.length > 0) && (
                <Card>
                  <CardContent>
                    <div className="pt-3 grid md:grid-cols-2 gap-6">
                      {database.pros && database.pros.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium mb-3 text-green-600 dark:text-green-500">Pros</h3>
                          <ul className="space-y-2">
                            {database.pros.map((pro, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                <span>{pro}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {database.cons && database.cons.length > 0 && (
                        <div>
                          <h3 className="text-lg font-medium mb-3 text-red-600 dark:text-red-500">Cons</h3>
                          <ul className="space-y-2">
                            {database.cons.map((con, index) => (
                              <li key={index} className="flex items-start">
                                <XCircle className="h-5 w-5 text-red-600 dark:text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                                <span>{con}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Not Recommended For */}
              {database.notRecommendedFor && database.notRecommendedFor.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Not Recommended For</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {database.notRecommendedFor.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <XCircle className="h-5 w-5 text-orange-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Database Interactions Component */}
              <DatabaseInteractions databaseSlug={database.slug} />
            </div>

            <div className="space-y-6">
              {/* Info Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Database Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Type</h3>
                    <p>{database.type}</p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">License</h3>
                    <p>{database.license}</p>
                  </div>

                  {/* Deployment Options */}
                  {(database.selfHosted || database.cloudOffering) && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Deployment Options</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {database.selfHosted && (
                          <Badge variant="outline">Self-Hosted</Badge>
                        )}
                        {database.cloudOffering && (
                          <Badge variant="outline">Cloud Service</Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Supported Languages */}
                  {database.languages && database.languages.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Supported Languages</h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {database.languages.map((language, index) => (
                          <Badge key={index} variant="outline">{language}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {database.stars !== undefined && database.stars > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">GitHub Stars</h3>
                      <p>{database.stars.toLocaleString()}</p>
                    </div>
                  )}

                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h3>
                    <p>{new Date(database.updatedAt).toLocaleDateString()}</p>
                  </div>

                  {database.contributors && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Contributors</h3>
                      <p className="text-sm">{database.contributors}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Contribute Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Contribute</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    This database information is stored as a markdown file in our repository. 
                    Help us improve this profile!
                  </p>
                  <div className="flex flex-col space-y-2">
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link to={`/edit-database/${database.slug}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit this database
                      </Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <a href="https://github.com/aolbeam/db-directory" target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        View on GitHub
                      </a>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Flag className="mr-2 h-4 w-4" />
                      Report an issue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Skeleton component for loading state
const DatabaseDetailSkeleton = () => (
  <>
    <Card className="mb-8">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <Skeleton className="w-16 h-16 rounded-lg" />
          <div className="flex-grow">
            <Skeleton className="h-10 w-64 mb-3" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        </div>
      </div>
    </Card>

    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-7 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-7 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <Skeleton className="h-7 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div>
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Separator />
            <div>
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-6 w-24" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </>
);

export default DatabaseDetail;