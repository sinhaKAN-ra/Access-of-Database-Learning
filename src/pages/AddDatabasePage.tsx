import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import { PlusCircle, MinusCircle, Github } from "lucide-react";
import { Card } from "@/components/ui/card";
import { addDatabase } from "@/services/databaseService";
import { DatabaseType } from "@/types/database";
import { getUserProfile, setGitHubUsername } from "@/services/userInteractionService";
import { GitHubUsernamePrompt } from "@/components/GitHubUsernamePrompt";

const AddDatabasePage = () => {
  const { toast: uiToast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const [showUsernamePrompt, setShowUsernamePrompt] = useState(false);
  
  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [tagline, setTagline] = useState("");
  const [keyStrength, setKeyStrength] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [documentationUrl, setDocumentationUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [license, setLicense] = useState("");
  const [cloudOffering, setCloudOffering] = useState(false);
  const [selfHosted, setSelfHosted] = useState(false);
  
  // Dynamic lists
  const [features, setFeatures] = useState([""]);
  const [useCases, setUseCases] = useState([""]);
  const [languages, setLanguages] = useState([""]);
  const [pros, setPros] = useState([""]);
  const [cons, setCons] = useState([""]);
  const [notRecommendedFor, setNotRecommendedFor] = useState([""]);

  // Check for user on component mount
  useState(() => {
    const checkUser = async () => {
      const profile = await getUserProfile();
      setUser(profile);
    };
    checkUser();
  });
  
  // Generic handler for dynamic list fields
  const handleListChange = (
    index: number, 
    value: string, 
    list: string[], 
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const newList = [...list];
    newList[index] = value;
    setList(newList);
  };

  const addListItem = (
    list: string[], 
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList([...list, ""]);
  };

  const removeListItem = (
    index: number, 
    list: string[], 
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (list.length > 1) {
      const newList = list.filter((_, i) => i !== index);
      setList(newList);
    }
  };

  const handleUsernameSet = async (username: string) => {
    const profile = await getUserProfile();
    setUser(profile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user has set GitHub username
    if (!user) {
      setShowUsernamePrompt(true);
      return;
    }
    
    // Basic validation
    if (!name || !description || !category || !type || !license) {
      uiToast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    // Filter out empty values from arrays
    const filteredFeatures = features.filter((feature) => feature.trim() !== "");
    const filteredUseCases = useCases.filter((useCase) => useCase.trim() !== "");
    const filteredLanguages = languages.filter((language) => language.trim() !== "");
    const filteredPros = pros.filter((pro) => pro.trim() !== "");
    const filteredCons = cons.filter((con) => con.trim() !== "");
    const filteredNotRecommendedFor = notRecommendedFor.filter((item) => item.trim() !== "");
    
    try {
      setIsSubmitting(true);
      
      // Create database object
      const newDatabaseData = {
        name,
        description,
        shortDescription: shortDescription || description.substring(0, 120) + '...',
        tagline,
        keyStrength,
        logoUrl: logoUrl || undefined,
        websiteUrl: websiteUrl || undefined,
        documentationUrl: documentationUrl || undefined,
        githubUrl: githubUrl || undefined,
        category,
        type: type as DatabaseType["type"],
        license: license as DatabaseType["license"],
        cloudOffering,
        selfHosted,
        features: filteredFeatures,
        useCases: filteredUseCases,
        languages: filteredLanguages,
        pros: filteredPros,
        cons: filteredCons,
        notRecommendedFor: filteredNotRecommendedFor,
        popularity: 50, // Default popularity for new entries
        useCaseDetails: [],
        contributors: user.username, // Set the contributor
      };
      
      // Add the database
      const savedDatabase = await addDatabase(newDatabaseData);
      
      console.log("Saved database:", savedDatabase);
      
      // Show success message
      toast.success("Database added successfully! It's now stored as a markdown file in the repository.");
      
      // Redirect to the new database page
      setTimeout(() => {
        navigate(`/database/${savedDatabase.slug}`);
      }, 2000);
    } catch (error) {
      console.error("Error saving database:", error);
      toast.error("Failed to add database. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="pt-24 pb-16 container px-4 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="p-8">
            <h1 className="text-2xl font-bold mb-6">Add a New Database</h1>
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                <Github className="h-4 w-4" />
                Open Source & Transparent
              </h3>
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                Your contribution will be stored as a markdown file in our GitHub repository. 
                This ensures full transparency, version control, and allows anyone to contribute directly via GitHub.
                {!user && " Please set your GitHub username to get started."}
              </p>
              {!user && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => setShowUsernamePrompt(true)}
                >
                  <Github className="mr-2 h-4 w-4" />
                  Set GitHub Username
                </Button>
              )}
              {user && (
                <p className="text-blue-700 dark:text-blue-300 text-sm mt-2">
                  Contributing as: <strong>{user.username}</strong>
                </p>
              )}
            </div>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="mb-1.5 block">
                      Database Name <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. PostgreSQL"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="logoUrl" className="mb-1.5 block">
                      Logo URL
                    </Label>
                    <Input 
                      id="logoUrl"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="https://example.com/logo.png"
                      type="url"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="tagline" className="mb-1.5 block">
                    Tagline
                  </Label>
                  <Input 
                    id="tagline"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="A brief, catchy description"
                  />
                </div>
                
                <div>
                  <Label htmlFor="shortDescription" className="mb-1.5 block">
                    Short Description 
                  </Label>
                  <Input 
                    id="shortDescription"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Brief description for listings (optional)"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description" className="mb-1.5 block">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea 
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a comprehensive description of the database..."
                    rows={5}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="keyStrength" className="mb-1.5 block">
                    Key Strength
                  </Label>
                  <Input 
                    id="keyStrength"
                    value={keyStrength}
                    onChange={(e) => setKeyStrength(e.target.value)}
                    placeholder="What makes this database stand out?"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="category" className="mb-1.5 block">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Relational">Relational</SelectItem>
                          <SelectItem value="Document">Document</SelectItem>
                          <SelectItem value="Key-Value">Key-Value</SelectItem>
                          <SelectItem value="Graph">Graph</SelectItem>
                          <SelectItem value="Time Series">Time Series</SelectItem>
                          <SelectItem value="Vector">Vector</SelectItem>
                          <SelectItem value="In-Memory">In-Memory</SelectItem>
                          <SelectItem value="Analytics">Analytics</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="type" className="mb-1.5 block">
                      Type <span className="text-red-500">*</span>
                    </Label>
                    <Select value={type} onValueChange={setType} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="SQL">SQL</SelectItem>
                          <SelectItem value="NoSQL">NoSQL</SelectItem>
                          <SelectItem value="NewSQL">NewSQL</SelectItem>
                          <SelectItem value="Graph">Graph</SelectItem>
                          <SelectItem value="Time Series">Time Series</SelectItem>
                          <SelectItem value="Key-Value">Key-Value</SelectItem>
                          <SelectItem value="Document">Document</SelectItem>
                          <SelectItem value="Vector">Vector</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="license" className="mb-1.5 block">
                      License <span className="text-red-500">*</span>
                    </Label>
                    <Select value={license} onValueChange={setLicense} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select license" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Open Source">Open Source</SelectItem>
                          <SelectItem value="Commercial">Commercial</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                          <SelectItem value="Unknown">Unknown</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="cloudOffering" 
                      checked={cloudOffering} 
                      onCheckedChange={() => setCloudOffering(!cloudOffering)} 
                    />
                    <Label htmlFor="cloudOffering">Cloud Offering</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="selfHosted" 
                      checked={selfHosted} 
                      onCheckedChange={() => setSelfHosted(!selfHosted)} 
                    />
                    <Label htmlFor="selfHosted">Self-Hosted</Label>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Links</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="websiteUrl" className="mb-1.5 block">
                    Website URL
                  </Label>
                  <Input 
                    id="websiteUrl"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://example.com"
                    type="url"
                  />
                </div>
                
                <div>
                  <Label htmlFor="documentationUrl" className="mb-1.5 block">
                    Documentation URL
                  </Label>
                  <Input 
                    id="documentationUrl"
                    value={documentationUrl}
                    onChange={(e) => setDocumentationUrl(e.target.value)}
                    placeholder="https://docs.example.com"
                    type="url"
                  />
                </div>
                
                <div>
                  <Label htmlFor="githubUrl" className="mb-1.5 block">
                    GitHub URL
                  </Label>
                  <Input 
                    id="githubUrl"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/example/repo"
                    type="url"
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Features & Details</h2>
              
              <div className="space-y-6">
                {/* Features */}
                <div>
                  <Label className="mb-1.5 block">Features</Label>
                  {features.map((feature, index) => (
                    <div key={`feature-${index}`} className="flex gap-2 mb-2">
                      <Input 
                        value={feature}
                        onChange={(e) => handleListChange(index, e.target.value, features, setFeatures)}
                        placeholder={`Feature ${index + 1}`}
                      />
                      <Button 
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeListItem(index, features, setFeatures)}
                        disabled={features.length === 1}
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-1"
                    onClick={() => addListItem(features, setFeatures)}
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add Feature
                  </Button>
                </div>
                
                {/* Use Cases */}
                <div>
                  <Label className="mb-1.5 block">Use Cases</Label>
                  {useCases.map((useCase, index) => (
                    <div key={`useCase-${index}`} className="flex gap-2 mb-2">
                      <Input 
                        value={useCase}
                        onChange={(e) => handleListChange(index, e.target.value, useCases, setUseCases)}
                        placeholder={`Use Case ${index + 1}`}
                      />
                      <Button 
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeListItem(index, useCases, setUseCases)}
                        disabled={useCases.length === 1}
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-1"
                    onClick={() => addListItem(useCases, setUseCases)}
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add Use Case
                  </Button>
                </div>
                
                {/* Languages */}
                <div>
                  <Label className="mb-1.5 block">Supported Languages</Label>
                  {languages.map((language, index) => (
                    <div key={`language-${index}`} className="flex gap-2 mb-2">
                      <Input 
                        value={language}
                        onChange={(e) => handleListChange(index, e.target.value, languages, setLanguages)}
                        placeholder={`Language ${index + 1}`}
                      />
                      <Button 
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeListItem(index, languages, setLanguages)}
                        disabled={languages.length === 1}
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-1"
                    onClick={() => addListItem(languages, setLanguages)}
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add Language
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Pros, Cons & Limitations</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Pros */}
                <div>
                  <Label className="mb-1.5 block">Pros</Label>
                  {pros.map((pro, index) => (
                    <div key={`pro-${index}`} className="flex gap-2 mb-2">
                      <Input 
                        value={pro}
                        onChange={(e) => handleListChange(index, e.target.value, pros, setPros)}
                        placeholder={`Pro ${index + 1}`}
                      />
                      <Button 
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeListItem(index, pros, setPros)}
                        disabled={pros.length === 1}
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-1"
                    onClick={() => addListItem(pros, setPros)}
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add Pro
                  </Button>
                </div>
                
                {/* Cons */}
                <div>
                  <Label className="mb-1.5 block">Cons</Label>
                  {cons.map((con, index) => (
                    <div key={`con-${index}`} className="flex gap-2 mb-2">
                      <Input 
                        value={con}
                        onChange={(e) => handleListChange(index, e.target.value, cons, setCons)}
                        placeholder={`Con ${index + 1}`}
                      />
                      <Button 
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeListItem(index, cons, setCons)}
                        disabled={cons.length === 1}
                      >
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-1"
                    onClick={() => addListItem(cons, setCons)}
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Add Con
                  </Button>
                </div>
              </div>

              {/* Not Recommended For */}
              <div className="mt-6">
                <Label className="mb-1.5 block">Not Recommended For</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Scenarios or use cases where this database might not be the best choice
                </p>
                {notRecommendedFor.map((item, index) => (
                  <div key={`notRecommended-${index}`} className="flex gap-2 mb-2">
                    <Input 
                      value={item}
                      onChange={(e) => handleListChange(index, e.target.value, notRecommendedFor, setNotRecommendedFor)}
                      placeholder={`Not recommended for ${index + 1}`}
                    />
                    <Button 
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeListItem(index, notRecommendedFor, setNotRecommendedFor)}
                      disabled={notRecommendedFor.length === 1}
                    >
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button 
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-1"
                  onClick={() => addListItem(notRecommendedFor, setNotRecommendedFor)}
                >
                  <PlusCircle className="h-4 w-4 mr-1" />
                  Add Limitation
                </Button>
              </div>
            </Card>

            <div className="flex justify-end">
              <Button 
                type="submit"
                className="bg-gradient-to-r from-db-primary to-db-secondary hover:opacity-90 px-8"
                size="lg"
                disabled={isSubmitting || !user}
              >
                {isSubmitting ? "Submitting..." : "Submit Database"}
              </Button>
            </div>
          </Card>
        </form>

        {/* GitHub Username Prompt */}
        <GitHubUsernamePrompt
          open={showUsernamePrompt}
          onOpenChange={setShowUsernamePrompt}
          onUsernameSet={handleUsernameSet}
        />
      </div>
    </Layout>
  );
};

export default AddDatabasePage;