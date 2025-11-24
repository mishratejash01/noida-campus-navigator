import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ShoppingBag, Tag, Phone } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Marketplace() {
  const [items, setItems] = useState<any[]>([]);
  const [showFreeOnly, setShowFreeOnly] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [showFreeOnly]);

  const fetchItems = async () => {
    let query = supabase.from("marketplace_listings").select("*");
    
    if (showFreeOnly) {
      query = query.eq("is_giveaway", true);
    }

    const { data, error } = await query.order("created_at", { ascending: false });
    if (!error && data) setItems(data);
  };

  return (
    <div className="container mx-auto p-6 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2 text-slate-800">
            <ShoppingBag className="h-8 w-8 text-purple-600" />
            Student Market
          </h1>
          <p className="text-slate-500">Buy, sell, or grab free stuff.</p>
        </div>

        <div className="flex items-center space-x-2 bg-white p-3 rounded-lg border shadow-sm">
          <Switch id="free-mode" checked={showFreeOnly} onCheckedChange={setShowFreeOnly} />
          <Label htmlFor="free-mode" className="cursor-pointer font-medium text-slate-700">
            Show Free / Giveaways Only 🎁
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400">
            <p className="text-lg">No items found. Maybe sell your old textbooks?</p>
          </div>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="aspect-video bg-slate-100 relative overflow-hidden">
                <img 
                  src={item.images?.[0] || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=60"} 
                  alt={item.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                {item.is_giveaway && (
                  <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">FREE</Badge>
                )}
                <Badge variant="secondary" className="absolute bottom-2 left-2 bg-white/90 text-slate-800 backdrop-blur-sm">
                  {item.condition}
                </Badge>
              </div>
              
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg leading-tight text-slate-800">{item.title}</h3>
                  <span className="font-bold text-green-600 text-lg">
                    {item.is_giveaway ? "₹0" : `₹${item.price}`}
                  </span>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-slate-600 text-sm line-clamp-2">{item.description}</p>
                <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
                  <Tag className="h-3 w-3" /> {item.category}
                  <span>•</span>
                  {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                </div>
              </CardContent>

              <CardFooter>
                <Button className="w-full gap-2 bg-slate-900 hover:bg-slate-800">
                  <Phone className="h-4 w-4" /> Contact Seller
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
