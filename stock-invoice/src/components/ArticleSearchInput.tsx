import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Article {
  ref: string;
  libelle: string;
  prixVenteTTC: number;
  tauxTva: number;
}

interface ArticleSearchInputProps {
  articles: Article[];
  value: string;
  onSelect: (ref: string) => void;
  placeholder?: string;
}

const ArticleSearchInput = ({
  articles,
  value,
  onSelect,
  placeholder = "Rechercher par réf. ou libellé...",
}: ArticleSearchInputProps) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedArticle = articles.find((a) => a.ref === value);

  useEffect(() => {
    if (value && selectedArticle) {
      setSearch(`${selectedArticle.ref} - ${selectedArticle.libelle}`);
    } else if (!value) {
      setSearch("");
    }
  }, [value, selectedArticle]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = articles.filter(
    (a) =>
      a.ref.toLowerCase().includes(search.toLowerCase()) ||
      a.libelle.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (ref: string) => {
    onSelect(ref);
    const art = articles.find((a) => a.ref === ref);
    if (art) setSearch(`${art.ref} - ${art.libelle}`);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="neu-input pl-8"
        />
      </div>
      {isOpen && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto rounded-md border border-border bg-popover shadow-md">
          {filtered.map((article) => (
            <button
              key={article.ref}
              type="button"
              className="w-full px-3 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={() => handleSelect(article.ref)}
            >
              <span className="font-medium">{article.ref}</span>
              <span className="text-muted-foreground"> — {article.libelle}</span>
            </button>
          ))}
        </div>
      )}
      {isOpen && search && filtered.length === 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-popover shadow-md p-3 text-sm text-muted-foreground text-center">
          Aucun article trouvé
        </div>
      )}
    </div>
  );
};

export default ArticleSearchInput;
