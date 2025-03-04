export const getGuardianAuthor = (article: any): string => {
  if (article.tags && article.tags.length > 0) {
    const firstName = article.tags[0].firstName || "";
    const lastName = article.tags[0].lastName || "";
    return (
      `${firstName} ${lastName}`.trim() || article.tags[0].webTitle || "Unknown"
    );
  }
  return "Unknown";
};
