import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { format, parseISO } from "date-fns";

const dayTranslations = {
  Monday: "Δευτέρα",
  Tuesday: "Τρίτη",
  Wednesday: "Τετάρτη",
  Thursday: "Πέμπτη",
  Friday: "Παρασκευή",
  Saturday: "Σάββατο",
  Sunday: "Κυριακή",
};

const SpecialMenusGrid = ({ menus = [] }) => {
  if (!menus.length) {
    return (
      <p className="text-gray-500 italic">
        ❌ Δεν υπάρχουν διαθέσιμα Special Menus.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
      {menus.map((menu) => (
        <Card
          key={menu.id}
          className="transition-transform hover:scale-[1.02] bg-white/80 backdrop-blur-lg shadow-xl border border-gray-200 rounded-2xl overflow-hidden"
        >
          <img
            src={menu.photoUrl}
            alt={menu.name}
            className="w-full h-40 sm:h-44 object-cover"
          />

          <div className="p-4 sm:p-5 space-y-4 text-sm sm:text-base text-gray-700">
            {/* Title */}
            <h3 className="text-[1rem] sm:text-lg md:text-xl font-semibold text-gray-900">
              {menu.name}
            </h3>

            {/* Promo Section */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
              <Badge className="bg-red-600 text-white text-xs sm:text-sm px-3 py-1 rounded-full shadow-sm">
                -{menu.discountPercentage}% | {menu.name}
              </Badge>

              <p className="font-medium text-gray-800">{menu.description}</p>

              <div className="flex items-center gap-3">
                <span className="text-gray-500 line-through">
                  €{menu.originalPrice}
                </span>
                <span className="text-red-600 text-lg sm:text-xl font-extrabold">
                  €{menu.discountedPrice}
                </span>
              </div>

              {menu.selectedItems?.length > 0 && (
                <div className="mt-2">
                  <strong className="text-gray-900">Περιλαμβάνει:</strong>
                  <ul className="list-disc list-inside mt-1 space-y-1 text-sm sm:text-base">
                    {menu.selectedItems.map((item) => (
                      <li key={item.id}>{item.name}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Availability */}
              <div className="bg-white/60 border border-red-300 rounded-lg p-3 shadow-inner space-y-1 text-sm sm:text-base text-gray-800">
                <div className="flex items-center gap-2 font-semibold text-red-700">
                  🕒 Διαθεσιμότητα Προσφοράς
                </div>

                {menu.availability.type === "specific" && (
                  <>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">Ημερομηνία:</span>
                      <span className="font-medium">
                        {menu.availability.dates
                          ?.map((d) => format(parseISO(d), "dd/MM/yyyy"))
                          .join(", ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Ώρα:</span>
                      <span className="font-medium">
                        {menu.availability.timeRange.start} –{" "}
                        {menu.availability.timeRange.end}
                      </span>
                    </div>
                  </>
                )}

                {menu.availability.type === "recurring" && (
                  <>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">Ημέρες:</span>
                      <span className="font-medium">
                        {menu.availability.daysOfWeek
                          ?.map((day) => dayTranslations[day] || day)
                          .join(", ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Ώρα:</span>
                      <span className="font-medium">
                        {menu.availability.timeRange.start} –{" "}
                        {menu.availability.timeRange.end}
                      </span>
                    </div>
                  </>
                )}

                {menu.availability.type === "permanent" && (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Καθημερινά:</span>
                    <span className="font-medium">
                      {menu.availability.timeRange.start} –{" "}
                      {menu.availability.timeRange.end}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SpecialMenusGrid;
