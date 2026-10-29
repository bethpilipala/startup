import { useEffect, useState } from "react";
import strings from "../../strings/en.js";

const simulatedActivities = [
  strings.home.mockActivities.savedPasta,
  strings.home.mockActivities.addedProduce,
  strings.home.mockActivities.foundMatch,
  strings.home.mockActivities.savedEggs,
];

const activityIntervalMs = 10000;
const maxVisibleActivities = 4;

export default function ActivityFeed() {
  const [activities, setActivities] = useState([
    { id: "activity-initial", message: simulatedActivities[0] },
  ]);

  useEffect(() => {
    let activityIndex = 1;
    let activityId = 0;

    const intervalId = window.setInterval(() => {
      const activity = {
        id: `activity-${activityId++}`,
        message: simulatedActivities[activityIndex],
      };
      activityIndex = (activityIndex + 1) % simulatedActivities.length;
      setActivities((currentActivities) => [
        activity,
        ...currentActivities,
      ].slice(0, maxVisibleActivities));
    }, activityIntervalMs);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="activity-feed" aria-labelledby="activity-feed-heading">
      <h2 id="activity-feed-heading">{strings.home.activityFeedHeading}</h2>
      <p>{strings.home.activityFeedNotice}</p>
      <ul aria-live="polite" aria-relevant="additions">
        {activities.map((activity) => (
          <li key={activity.id}>{activity.message}</li>
        ))}
      </ul>
    </section>
  );
}
