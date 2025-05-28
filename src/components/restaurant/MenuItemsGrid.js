import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Utensils } from "lucide-react";

const MenuItemsGrid = ({ dishes }) => {
  const [selectedDish, setSelectedDish] = useState(null);

  if (!dishes?.length) {
    return (
      <p className="text-gray-500 text-center italic mt-6 text-sm sm:text-base">
        ❌ Δεν υπάρχουν διαθέσιμα πιάτα σε αυτή την κατηγορία.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {dishes.map((dish) => (
          <Card
            key={dish.id}
            className="h-[300px] sm:h-[340px] flex flex-col rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all bg-white border border-gray-200"
          >
            {dish.photoUrl ? (
              <img
                src={dish.photoUrl}
                alt={dish.name}
                className="w-full h-28 sm:h-32 object-cover"
              />
            ) : (
              <div className="w-full h-28 sm:h-32 bg-gray-100 flex items-center justify-center">
                <Utensils className="w-8 h-8 text-gray-400" />
              </div>
            )}

            <CardHeader className="px-3 pt-2 pb-1">
              <CardTitle className="text-sm sm:text-base font-semibold text-gray-900 tracking-tight truncate">
                {dish.name}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 px-3 pt-1 pb-3 flex flex-col justify-between text-sm sm:text-[15px] text-gray-700">
              <p className="line-clamp-3 leading-snug mb-2">
                {dish.description || "Χωρίς περιγραφή."}
              </p>

              <div className="flex justify-between items-center mt-auto">
                <span className="text-primary font-bold">€{dish.price}</span>
                {dish.discount > 0 && (
                  <Badge className="bg-red-600 text-white text-[11px] sm:text-xs px-2 py-0.5 rounded-full">
                    -{dish.discount}%
                  </Badge>
                )}
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full mt-2 text-xs sm:text-sm"
                    onClick={() => setSelectedDish(dish)}
                  >
                    Περισσότερα
                  </Button>
                </DialogTrigger>
                {selectedDish?.id === dish.id && (
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-lg sm:text-xl font-bold">
                        🍽️ {dish.name}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 text-sm sm:text-base text-gray-700">
                      {dish.photoUrl ? (
                        <img
                          src={dish.photoUrl}
                          alt={dish.name}
                          className="w-full h-40 sm:h-52 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-40 sm:h-52 bg-gray-100 flex items-center justify-center rounded-lg">
                          <Utensils className="w-10 h-10 text-gray-400" />
                        </div>
                      )}
                      <p>{dish.description || "Δεν υπάρχει διαθέσιμη περιγραφή."}</p>
                      <p>
                        <strong>Τιμή:</strong> €{dish.price}
                      </p>
                      {dish.discount > 0 && (
                        <p>
                          <strong>Έκπτωση:</strong> -{dish.discount}%
                        </p>
                      )}
                      {dish.category && (
                        <p>
                          <strong>Κατηγορία:</strong> {dish.category}
                        </p>
                      )}
                    </div>
                  </DialogContent>
                )}
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default MenuItemsGrid;
