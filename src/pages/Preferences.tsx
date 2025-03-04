import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNews } from "@/context/NewsProvider";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function PreferencesPage() {
  const {
    preferences,
    updatePreferences,
    sources,
    categories,
    newsAuthors,
    loading,
  } = useNews();

  const [selectedSources, setSelectedSources] = useState<string[]>(
    preferences?.sources ?? []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    preferences?.categories ?? []
  );
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>(
    preferences?.authors ?? []
  );

  const [sourceSearchQuery, setSourceSearchQuery] = useState("");
  const [authorSearchQuery, setAuthorSearchQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setSelectedSources(preferences?.sources ?? []);
    setSelectedCategories(preferences?.categories ?? []);
    setSelectedAuthors(preferences?.authors ?? []);
  }, [preferences]);

  const filteredSources = useMemo(() => {
    return sources.filter((source) =>
      source.name.toLowerCase().includes(sourceSearchQuery.toLowerCase())
    );
  }, [sourceSearchQuery, sources]);

  const topAuthors = useMemo(() => {
    return newsAuthors.length > 10 ? newsAuthors.slice(0, 10) : newsAuthors;
  }, [newsAuthors]);

  const filteredAuthors = useMemo(() => {
    return newsAuthors
      .filter((author) => author && author.trim() !== "Unknown")
      .filter((author) =>
        author.toLowerCase().includes(authorSearchQuery.toLowerCase())
      );
  }, [authorSearchQuery, newsAuthors]);

  const handleSave = () => {
    updatePreferences({
      sources: selectedSources,
      categories: selectedCategories,
      authors: selectedAuthors,
    });
    toast.success("Preferences Saved");
    navigate("/");
  };

  const handleResetPreferences = () => {
    localStorage.removeItem("newsPreferences");
    setSelectedSources([]);
    setSelectedCategories([]);
    setSelectedAuthors([]);
    toast.info("Preferences Reset");
    navigate("/");
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(sourceSearchQuery.toLowerCase())
    );
  }, [sourceSearchQuery, categories]);

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Feed Preferences</CardTitle>
      </CardHeader>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* ✅ Sources Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Sources</h3>
              <Input
                placeholder="Search Sources..."
                value={sourceSearchQuery}
                onChange={(e) => setSourceSearchQuery(e.target.value)}
                className="mb-2"
              />
              <div className="h-52 overflow-y-auto border p-2 rounded-md">
                {filteredSources.map((source) => (
                  <div
                    key={source.id}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <Checkbox
                      checked={selectedSources.includes(source.id)}
                      onCheckedChange={(checked) => {
                        setSelectedSources((prev) =>
                          checked
                            ? [...prev, source.id]
                            : prev.filter((id) => id !== source.id)
                        );
                      }}
                    />
                    <Label>{source.name}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* ✅ Categories Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Categories</h3>
              <div className="h-52 overflow-y-auto border p-2 rounded-md">
                {filteredCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center space-x-2 mb-2"
                  >
                    <Checkbox
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) => {
                        setSelectedCategories((prev) =>
                          checked
                            ? [...prev, category.id]
                            : prev.filter((id) => id !== category.id)
                        );
                      }}
                    />
                    <Label>{category.name}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* ✅ Authors Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Authors</h3>
              <Input
                placeholder="Search Authors..."
                value={authorSearchQuery}
                onChange={(e) => setAuthorSearchQuery(e.target.value)}
                className="mb-2"
              />
              <div className="h-52 overflow-y-auto border p-2 rounded-md">
                {authorSearchQuery.length === 0
                  ? topAuthors.map((author) => (
                      <div
                        key={author}
                        className="flex items-center space-x-2 mb-2"
                      >
                        <Checkbox
                          checked={selectedAuthors.includes(author)}
                          onCheckedChange={(checked) => {
                            setSelectedAuthors((prev) =>
                              checked
                                ? [...prev, author]
                                : prev.filter((a) => a !== author)
                            );
                          }}
                        />
                        <Label>{author}</Label>
                      </div>
                    ))
                  : filteredAuthors.map((author) => (
                      <div
                        key={author}
                        className="flex items-center space-x-2 mb-2"
                      >
                        <Checkbox
                          checked={selectedAuthors.includes(author)}
                          onCheckedChange={(checked) => {
                            setSelectedAuthors((prev) =>
                              checked
                                ? [...prev, author]
                                : prev.filter((a) => a !== author)
                            );
                          }}
                        />
                        <Label>{author}</Label>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </CardContent>
      )}

      <CardFooter className="flex justify-end gap-3">
        <Button onClick={handleResetPreferences} disabled={loading}>
          Reset Preferences
        </Button>
        <Button onClick={handleSave} disabled={loading}>
          Save Preferences
        </Button>
      </CardFooter>
    </Card>
  );
}
