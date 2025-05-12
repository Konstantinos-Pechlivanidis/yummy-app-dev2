import RestaurantCard from "./RestaurantCard";

const ReserveResultsGrid = ({ restaurants }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {restaurants.map((resto) => (
      <RestaurantCard key={resto.id} resto={resto} />
    ))}
  </div>
);

export default ReserveResultsGrid;