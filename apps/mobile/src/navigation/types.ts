import type { ImageSourcePropType } from "react-native";
import type { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  Main: NavigatorScreenParams<MainTabParamList> | undefined;
  PostDetail: { postId: string };
  NewPost: undefined;
  JobWelfare: undefined;
  JobDetail: { title: string; organization: string; period: string; image: ImageSourcePropType };
  HealthMedical: undefined;
  HealthDetail: {
    title: string;
    organization: string;
    period: string;
    category: string;
    image: ImageSourcePropType;
  };
  EducationCulture: undefined;
  EducationDetail: {
    title: string;
    organization: string;
    period: string;
    category: string;
    image: ImageSourcePropType;
  };
  LifeConvenience: undefined;
  LifeConvenienceDetail: {
    title: string;
    organization: string;
    period: string;
    category: string;
    image: ImageSourcePropType;
  };
  Notifications: undefined;
  PartnerInfo: undefined;
  PartnerDetail: {
    title: string;
    service: string;
    category: string;
    image: ImageSourcePropType;
  };
  InterestSettings: undefined;
  NotificationSettings: undefined;
  CustomerCenter: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Services: undefined;
  Community: undefined;
  MyPage: undefined;
};
