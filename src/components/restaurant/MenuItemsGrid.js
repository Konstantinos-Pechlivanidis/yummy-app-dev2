import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

const MenuItemsGrid = ({ dishes }) => {
  if (!dishes?.length) {
    return (
      <p className="text-gray-500 text-center italic mt-6 text-sm sm:text-base">
        ❌ Δεν υπάρχουν διαθέσιμα πιάτα σε αυτή την κατηγορία.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {dishes.map((dish) => (
        <Card
          key={dish.id}
          className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all bg-white border border-gray-200"
        >
          <img
            src={dish.photoUrl}
            alt={dish.name}
            className="w-full h-28 sm:h-32 object-cover"
          />

          <CardHeader className="p-3 pb-1">
            <CardTitle className="text-sm sm:text-base font-semibold text-gray-900 tracking-tight">
              {dish.name}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-3 pt-1">
            <div className="flex justify-between items-center text-sm sm:text-base">
              <span className="text-primary font-bold">€{dish.price}</span>
              {dish.discount > 0 && (
                <Badge className="bg-red-600 text-white text-[11px] sm:text-xs px-2 py-0.5 rounded-full">
                  -{dish.discount}%
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MenuItemsGrid;
