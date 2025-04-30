import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { getDatabaseBySlug, updateDatabase } from "@/services/databaseService";
import { DatabaseType } from "@/types/database";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const EditDatabase = () => {
  const { user } = useAuth();
  const { slug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [database, setDatabase] = useState<DatabaseType | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<Omit<DatabaseType, "slug" | "id" | "createdAt" | "updatedAt">>>({
    name: "",
    description: "",
    shortDescription: "",
    websiteUrl: "",
    documentationUrl: "",
    githubUrl: "",
    category: "",
    // type/license are optional until loaded
    cloudOffering: false,
    selfHosted: false,
    features: [] as string[],
    useCases: [] as string[],
    languages: [] as string[],
    pros: [] as string[],
    cons: [] as string[],
  });

  useEffect(() => {
    const loadDatabase = async () => {
      if (!slug) return;
      try {
        const db = await getDatabaseBySlug(slug);
        if (db) {
          setDatabase(db);
          setFormData({
            name: db.name,
            description: db.description,
            shortDescription: db.shortDescription || "",
            websiteUrl: db.websiteUrl || "",
            documentationUrl: db.documentationUrl || "",
            githubUrl: db.githubUrl || "",
            category: db.category,
            type: db.type,
            license: db.license,
            cloudOffering: db.cloudOffering,
            selfHosted: db.selfHosted,
            features: db.features,
            useCases: db.useCases,
            languages: db.languages,
            pros: db.pros,
            cons: db.cons,
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load database information.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadDatabase();
  }, [slug, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!database) return;

    setSubmitting(true);
    try {
      await updateDatabase(database.id, formData);
      toast({
        title: "Success",
        description: "Database updated successfully!",
        duration: 3000,
      });
      navigate(`/databases/${database.slug}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update database. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleArrayInput = (field: string, value: string) => {
    const items = value.split(",").map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, [field]: items }));
  };

  if (loading) {
    return (
      <Layout>
        <div className="pt-24 pb-16 container">
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading database information...</span>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="pt-24 pb-16 container max-w-3xl">
          <Card className="p-8 border-l-4 border-l-yellow-500">
            <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
            <p className="mb-6">You need to be logged in to edit database information.</p>
            <Button onClick={() => navigate("/login")}>
              Log In
            </Button>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!database) {
    return (
      <Layout>
        <div className="pt-24 pb-16 container max-w-3xl">
          <Card className="p-8 border-l-4 border-l-red-500">
            <h1 className="text-2xl font-bold mb-4">Database Not Found</h1>
            <p className="mb-6">
              The database you're trying to edit doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/databases")}>View All Databases</Button>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pt-16 pb-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container max-w-4xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(`/databases/${database.slug}`)}
                className="mb-2"
              >
                ← Back to {database.name}
              </Button>
              <h1 className="text-3xl font-bold">Edit Database</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="p-6 shadow-sm">
              <h2 className="text-xl font-medium mb-4 pb-2 border-b">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name*</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    placeholder="Database name"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Short Description</label>
                  <Input
                    value={formData.shortDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                    placeholder="Brief one-line description"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Full Description*</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                    placeholder="Detailed description of the database"
                    className="w-full min-h-32"
                  />
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 shadow-sm">
                <h2 className="text-xl font-medium mb-4 pb-2 border-b">Links</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Website URL</label>
                    <Input
                      type="url"
                      value={formData.websiteUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Documentation URL</label>
                    <Input
                      type="url"
                      value={formData.documentationUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, documentationUrl: e.target.value }))}
                      placeholder="https://docs.example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">GitHub URL</label>
                    <Input
                      type="url"
                      value={formData.githubUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                      placeholder="https://github.com/example/repo"
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-sm">
                <h2 className="text-xl font-medium mb-4 pb-2 border-b">Classification</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category*</label>
                    <Input
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      required
                      placeholder="e.g., NoSQL, Relational, Time-series"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Type*</label>
                    <Input
                      value={formData.type ?? ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as DatabaseType["type"] }))}
                      required
                      placeholder="e.g., Document, Key-value, Graph"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">License*</label>
                    <Input
                      value={formData.license ?? ""}
                      onChange={(e) => setFormData(prev => ({ ...prev, license: e.target.value as DatabaseType["license"] }))}
                      required
                      placeholder="e.g., MIT, Apache 2.0, GPL"
                    />
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6 shadow-sm">
              <h2 className="text-xl font-medium mb-4 pb-2 border-b">Deployment Options</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="cloudOffering"
                    checked={formData.cloudOffering}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, cloudOffering: checked === true }))
                    }
                  />
                  <label htmlFor="cloudOffering" className="text-sm font-medium">
                    Cloud Offering Available
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="selfHosted"
                    checked={formData.selfHosted}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ ...prev, selfHosted: checked === true }))
                    }
                  />
                  <label htmlFor="selfHosted" className="text-sm font-medium">
                    Self-Hosted Option
                  </label>
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 shadow-sm">
                <h2 className="text-xl font-medium mb-4 pb-2 border-b">Features & Usage</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Key Features (comma-separated)</label>
                    <Textarea
                      value={formData.features.join(", ")}
                      onChange={(e) => handleArrayInput("features", e.target.value)}
                      placeholder="e.g., ACID compliance, Sharding, High availability"
                      className="min-h-20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Use Cases (comma-separated)</label>
                    <Textarea
                      value={formData.useCases.join(", ")}
                      onChange={(e) => handleArrayInput("useCases", e.target.value)}
                      placeholder="e.g., IoT data, Analytics, Content management"
                      className="min-h-20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Supported Languages (comma-separated)</label>
                    <Textarea
                      value={formData.languages.join(", ")}
                      onChange={(e) => handleArrayInput("languages", e.target.value)}
                      placeholder="e.g., JavaScript, Python, Java, Go"
                      className="min-h-20"
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-sm">
                <h2 className="text-xl font-medium mb-4 pb-2 border-b">Pros & Cons</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Pros (comma-separated)</label>
                    <Textarea
                      value={formData.pros.join(", ")}
                      onChange={(e) => handleArrayInput("pros", e.target.value)}
                      placeholder="e.g., Fast read operations, Low latency, Easy to scale"
                      className="min-h-20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cons (comma-separated)</label>
                    <Textarea
                      value={formData.cons.join(", ")}
                      onChange={(e) => handleArrayInput("cons", e.target.value)}
                      placeholder="e.g., Limited query capabilities, High memory usage"
                      className="min-h-20"
                    />
                  </div>
                </div>
              </Card>
            </div>

            <div className="sticky bottom-0 mt-8 pt-4 pb-4 bg-white dark:bg-gray-950 border-t flex justify-between items-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/databases/${database.slug}`)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={submitting}
                className="min-w-32"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EditDatabase;