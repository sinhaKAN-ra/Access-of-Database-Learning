
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { PlusCircle, Edit, AlertCircle, Github, Code, MessageCircle, GitPullRequest, BookOpen } from "lucide-react";

const ContributePage = () => {
  return (
    <Layout>
      <div className="pt-24 pb-16">
        <div className="container px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">Contribute to db.aolbeam.com</h1>
          <p className="text-lg text-muted-foreground mb-10">
            Join our open-source community and help build the world's most comprehensive
            database directory. There are many ways to contribute, regardless of your experience level.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="p-6 database-card">
              <div className="rounded-full bg-db-primary/10 p-4 inline-flex mb-4">
                <PlusCircle className="h-6 w-6 text-db-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-3">Add a New Database</h2>
              <p className="text-muted-foreground mb-6">
                Notice a database missing from our directory? Help expand our collection by adding it.
                All submissions are reviewed by our team before publication.
              </p>
              <Link to="/add-database">
                <Button className="bg-gradient-to-r from-db-primary to-db-secondary hover:opacity-90">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Database
                </Button>
              </Link>
            </Card>

            <Card className="p-6 database-card">
              <div className="rounded-full bg-db-primary/10 p-4 inline-flex mb-4">
                <Edit className="h-6 w-6 text-db-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-3">Edit Existing Information</h2>
              <p className="text-muted-foreground mb-6">
                Found inaccurate or outdated information? Help us maintain the quality of our directory
                by updating existing database profiles.
              </p>
              <Link to="/databases">
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Browse Databases to Edit
                </Button>
              </Link>
            </Card>

            <Card className="p-6 database-card">
              <div className="rounded-full bg-db-primary/10 p-4 inline-flex mb-4">
                <AlertCircle className="h-6 w-6 text-db-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-3">Report Issues</h2>
              <p className="text-muted-foreground mb-6">
                Spotted a problem with the website or content? Let us know by submitting an issue report,
                and we'll address it as soon as possible.
              </p>
              <a href="https://github.com/aolbeam/db-directory/issues/new" target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Report an Issue
                </Button>
              </a>
            </Card>

            <Card className="p-6 database-card">
              <div className="rounded-full bg-db-primary/10 p-4 inline-flex mb-4">
                <Code className="h-6 w-6 text-db-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-3">Code Contributions</h2>
              <p className="text-muted-foreground mb-6">
                Are you a developer? Help improve the codebase, add new features, fix bugs, or enhance
                the user experience by contributing code.
              </p>
              <a href="https://github.com/aolbeam/db-directory" target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <Github className="mr-2 h-4 w-4" />
                  Fork on GitHub
                </Button>
              </a>
            </Card>

            <Card className="p-6 database-card">
              <div className="rounded-full bg-db-primary/10 p-4 inline-flex mb-4">
                <GitPullRequest className="h-6 w-6 text-db-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-3">Submit Pull Requests</h2>
              <p className="text-muted-foreground mb-6">
                Have a fix or a new feature? Submit a pull request through GitHub to contribute directly to the codebase. 
                We welcome all improvements!
              </p>
              <a href="https://github.com/aolbeam/db-directory/pulls" target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <GitPullRequest className="mr-2 h-4 w-4" />
                  View Pull Requests
                </Button>
              </a>
            </Card>

            <Card className="p-6 database-card">
              <div className="rounded-full bg-db-primary/10 p-4 inline-flex mb-4">
                <BookOpen className="h-6 w-6 text-db-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-3">Documentation</h2>
              <p className="text-muted-foreground mb-6">
                Help improve our documentation, write tutorials, or create guides to make the project more accessible to everyone.
              </p>
              <a href="https://github.com/aolbeam/db-directory/wiki" target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <BookOpen className="mr-2 h-4 w-4" />
                  View Documentation
                </Button>
              </a>
            </Card>
          </div>

          <div className="bg-muted/50 rounded-lg p-8 border border-border">
            <h2 className="text-2xl font-semibold mb-4">Contribution Guidelines</h2>
            <div className="space-y-4">
              <p>
                To ensure the quality and consistency of our directory, we ask all contributors to follow these guidelines:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>Provide accurate and objective information about databases</li>
                <li>Include verifiable sources for technical claims when possible</li>
                <li>Avoid promotional language and focus on factual descriptions</li>
                <li>Be respectful of all database technologies and their communities</li>
                <li>Follow our formatting and content structure for consistency</li>
                <li>When comparing databases, strive for fairness and objectivity</li>
                <li>Follow the GitHub workflow for code contributions</li>
                <li>Write tests for new features when applicable</li>
              </ul>
              <p className="mt-4">
                All contributions are subject to review by our moderation team before publication.
                We may suggest edits or request additional information to ensure quality standards.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-2xl font-semibold mb-4">Have Questions About Contributing?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              If you have questions about how to contribute or need assistance with your submission,
              feel free to reach out to our team. We're here to help!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="https://github.com/aolbeam/db-directory/discussions" target="_blank" rel="noopener noreferrer">
                <Button variant="outline">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Join GitHub Discussions
                </Button>
              </a>
              <a href="mailto:contribute@aolbeam.com">
                <Button variant="outline">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Contact the Team
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContributePage;
