import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Home, MapPin, DollarSign, Star } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";

interface Housing {
  id: string;
  name: string;
  location: string;
  price_range: string;
  amenities: string[];
  rating: number | null;
  image_url: string | null;
}

const Housing = () => {
  const [housings, setHousings] = useState<Housing[]>([]);
  const [filteredHousings, setFilteredHousings] = useState<Housing[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  useEffect(() => {
    fetchHousings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [housings, locationFilter, sortBy]);

  const fetchHousings = async () => {
    try {
      const { data, error } = await supabase
        .from("housing")
        .select("*")
        .order("name");

      if (error) throw error;
      setHousings(data || []);
    } catch (error) {
      console.error("Error fetching housings:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...housings];

    // Location filter
    if (locationFilter !== "all") {
      filtered = filtered.filter((h) => h.location === locationFilter);
    }

    // Sorting
    if (sortBy === "price-low") {
      filtered.sort((a, b) => {
        const priceA = parseInt(a.price_range.split("-")[0].replace(/\D/g, ""));
        const priceB = parseInt(b.price_range.split("-")[0].replace(/\D/g, ""));
        return priceA - priceB;
      });
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => {
        const priceA = parseInt(a.price_range.split("-")[0].replace(/\D/g, ""));
        const priceB = parseInt(b.price_range.split("-")[0].replace(/\D/g, ""));
        return priceB - priceA;
      });
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setFilteredHousings(filtered);
  };

  const uniqueLocations = Array.from(new Set(housings.map((h) => h.location)));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Housing & Essentials</h1>
            <p className="text-muted-foreground">Find the perfect PG or hostel near your college</p>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="w-full sm:w-[200px] backdrop-blur-md bg-white/5 border-white/10">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {uniqueLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[200px] backdrop-blur-md bg-white/5 border-white/10">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Housing Grid */}
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="backdrop-blur-md bg-white/5 border-white/10">
                  <CardHeader>
                    <Skeleton className="h-48 w-full mb-4 rounded-lg" />
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : filteredHousings.length === 0 ? (
            <Card className="backdrop-blur-md bg-white/5 border-white/10 text-center py-12">
              <CardContent>
                <Home className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No Housing Found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters to see more results.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredHousings.map((housing, index) => (
                <motion.div
                  key={housing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="h-full backdrop-blur-md bg-white/5 border-white/10 hover:border-accent/50 hover:shadow-[0_0_20px_rgba(124,58,237,0.2)] transition-all group">
                    {housing.image_url && (
                      <div className="overflow-hidden rounded-t-lg">
                        <img
                          src={housing.image_url}
                          alt={housing.name}
                          className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-xl">{housing.name}</CardTitle>
                        {housing.rating && (
                          <div className="flex items-center gap-1 text-accent">
                            <Star className="h-4 w-4 fill-accent" />
                            <span className="font-semibold">{housing.rating}</span>
                          </div>
                        )}
                      </div>
                      <CardDescription className="space-y-2">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {housing.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          {housing.price_range}
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {housing.amenities.slice(0, 4).map((amenity, i) => (
                          <Badge key={i} variant="secondary" className="backdrop-blur-md bg-primary/10 border-primary/30 text-primary">
                            {amenity}
                          </Badge>
                        ))}
                        {housing.amenities.length > 4 && (
                          <Badge variant="secondary" className="backdrop-blur-md bg-white/5 border-white/10">
                            +{housing.amenities.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Housing;
