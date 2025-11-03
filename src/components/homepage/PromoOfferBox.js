import { format, parseISO } from "date-fns";
import { Badge } from "../ui/badge";

const PromoOfferBox = ({ menu, dayTranslations }) => {
  if (!menu) return null;

  const availability = menu.availability || null;
  const timeRange = availability?.timeRange || null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-4 text-sm sm:text-base text-gray-800">
      {/* Promo Badge */}
      <Badge className="bg-red-600 text-white text-xs sm:text-sm px-3 py-1 rounded-full shadow-sm">
        -{menu.discount_percentage || 0}% | {menu.name || "Προσφορά"}
      </Badge>

      {/* Description */}
      {menu.description && (
        <p className="text-gray-800 font-medium leading-snug">
          {menu.description}
        </p>
      )}

      {/* Price Info */}
      <div className="flex items-center gap-3">
        {menu.original_price && (
          <span className="text-gray-500 line-through text-sm sm:text-base">
            €{menu.original_price}
          </span>
        )}
        <span className="text-red-600 text-base sm:text-lg font-extrabold">
          €{menu.discounted_price || menu.price || "—"}
        </span>
      </div>

      {/* Included Items */}
      {menu.selectedItems?.length > 0 && (
        <div>
          <strong className="text-gray-900">Περιλαμβάνει:</strong>
          <ul className="list-disc list-inside mt-1 space-y-1 text-sm sm:text-base">
            {menu.selectedItems.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Availability */}
      {availability && (
        <div className="bg-white/60 border border-red-300 rounded-lg p-3 shadow-inner space-y-1 text-sm sm:text-base text-gray-800">
          <div className="flex items-center gap-2 font-semibold text-red-700">
            🕒 Διαθεσιμότητα Προσφοράς
          </div>

          {availability.type === "specific" && (
            <>
              {availability.dates?.length > 0 && (
                <div className="flex flex-wrap items-center gap-1">
                  <span className="font-semibold">Ημερομηνία:</span>
                  <span className="font-medium">
                    {availability.dates
                      .map((d) => {
                        try {
                          return format(parseISO(d), "dd/MM/yyyy");
                        } catch {
                          return d;
                        }
                      })
                      .join(", ")}
                  </span>
                </div>
              )}
              {timeRange?.start && timeRange?.end && (
                <div className="flex items-center gap-1">
                  <span className="font-semibold">Ώρα:</span>
                  <span className="font-medium">
                    {timeRange.start} – {timeRange.end}
                  </span>
                </div>
              )}
            </>
          )}

          {availability.type === "recurring" && (
            <>
              {availability.daysOfWeek?.length > 0 && (
                <div className="flex flex-wrap items-center gap-1">
                  <span className="font-semibold">Ημέρες:</span>
                  <span className="font-medium">
                    {availability.daysOfWeek
                      .map((day) => dayTranslations?.[day] || day)
                      .join(", ")}
                  </span>
                </div>
              )}
              {timeRange?.start && timeRange?.end && (
                <div className="flex items-center gap-1">
                  <span className="font-semibold">Ώρα:</span>
                  <span className="font-medium">
                    {timeRange.start} – {timeRange.end}
                  </span>
                </div>
              )}
            </>
          )}

          {availability.type === "permanent" && timeRange?.start && timeRange?.end && (
            <div className="flex items-center gap-1">
              <span className="font-semibold">Καθημερινά:</span>
              <span className="font-medium">
                {timeRange.start} – {timeRange.end}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PromoOfferBox;
