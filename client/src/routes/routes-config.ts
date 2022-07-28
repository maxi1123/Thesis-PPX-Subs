import { FC } from "react";
import { ROUTE } from "../enums/route";
import Home from "../pages/home/home";
import Onboarding from "../pages/onboarding/onboarding";
import Streams from "../pages/streams/streams";
import StreamPlayer from "../pages/stream-player/stream-player";
import SubscriptionEnd from "../pages/subscription-end/subscription-end";

export interface RouteConfigI {
  title: string;
  path: ROUTE;
  element: FC;
}

export const PublicRoutesConfig: Array<RouteConfigI> = [
  { title: "Home", path: ROUTE.Home, element: Home },
  {
    title: "Onboarding",
    path: ROUTE.Onboarding,
    element: Onboarding,
  },
];

export const PrivateRoutesConfig: Array<RouteConfigI> = [
  { title: "Streams", path: ROUTE.Streams, element: Streams },
  { title: "StreamsPlayer", path: ROUTE.StreamPlayer, element: StreamPlayer },
  {
    title: "SubscriptionEnd",
    path: ROUTE.SubscriptionEnd,
    element: SubscriptionEnd,
  },
];
