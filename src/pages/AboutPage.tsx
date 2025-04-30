
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Github, ExternalLink } from "lucide-react";

const AboutPage = () => {
  return (
    <Layout>
      <div className="pt-24 pb-16">
        <div className="container px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">About Database Hub Spectra</h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-lg text-muted-foreground">
              Database Hub Spectra is an open-source project dedicated to creating a comprehensive, 
              community-driven directory of databases from around the world. Our mission is to provide 
              developers, architects, and organizations with accurate and detailed information about 
              various database technologies to help them make informed decisions.
            </p>

            <h2 className="text-2xl font-semibold mt-10 mb-4">Our Mission</h2>
            <p>
              We believe in the power of knowledge sharing and community collaboration. Our mission is to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Create the most comprehensive database directory available</li>
              <li>Provide objective, accurate, and detailed information about database technologies</li>
              <li>Foster a community of database enthusiasts, developers, and experts</li>
              <li>Help individuals and organizations find the right database solution for their needs</li>
              <li>Support both open-source and commercial database technologies</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-10 mb-4">Community Contributions</h2>
            <p>
              This project thrives on community contributions. Whether you're a database expert or 
              just getting started, your knowledge and experience are valuable to us. Here's how you 
              can contribute:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>Add new databases to our directory</li>
              <li>Update and improve existing database profiles</li>
              <li>Share your experience with specific database technologies</li>
              <li>Report inaccuracies or outdated information</li>
              <li>Help improve the codebase and user experience</li>
            </ul>

            <div className="my-10 bg-muted/50 rounded-lg p-6 border border-border">
              <h3 className="text-xl font-semibold mb-3">How to Contribute</h3>
              <p className="mb-4">
                Ready to contribute to Database Hub Spectra? There are several ways to get involved:
              </p>
              <div className="space-y-3">
                <Link to="/add-database">
                  <Button variant="outline" className="mr-4">
                    Add a Database
                  </Button>
                </Link>
                <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="mr-4">
                    <Github className="mr-2 h-4 w-4" />
                    Fork on GitHub
                  </Button>
                </a>
                <Link to="/contribute">
                  <Button variant="outline">
                    Learn More About Contributing
                  </Button>
                </Link>
              </div>
            </div>

            <h2 className="text-2xl font-semibold mt-10 mb-4">Our Team</h2>
            <p>
              Database Hub Spectra started as a passion project by a group of database enthusiasts 
              who wanted to create a better resource for the community. Today, it's maintained by 
              a global community of contributors dedicated to building and improving this resource.
            </p>

            <h2 className="text-2xl font-semibold mt-10 mb-4">Contact Us</h2>
            <p>
              Have questions, suggestions, or just want to get in touch? We'd love to hear from you!
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-6">
              <li>
                <strong>GitHub:</strong>{" "}
                <a 
                  href="https://github.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-db-primary hover:underline inline-flex items-center"
                >
                  Visit our repository
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
              <li>
                <strong>Email:</strong>{" "}
                <a 
                  href="mailto:contact@databasehubspectra.org" 
                  className="text-db-primary hover:underline"
                >
                  contact@databasehubspectra.org
                </a>
              </li>
              <li>
                <strong>Twitter:</strong>{" "}
                <a 
                  href="https://twitter.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-db-primary hover:underline inline-flex items-center"
                >
                  @DBHubSpectra
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </li>
            </ul>

            <h2 className="text-2xl font-semibold mt-10 mb-4">Licensing</h2>
            <p>
              Database Hub Spectra is an open-source project. The codebase is licensed under the 
              MIT license, and the content is available under the Creative Commons Attribution-ShareAlike 
              4.0 International (CC BY-SA 4.0) license. This means you're free to use, share, and 
              adapt the content as long as you attribute Database Hub Spectra and share your 
              contributions under the same license.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
