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
  JobDetail: {
    title: string;
    organization: string;
    period: string;
    category?: string;
    image: ImageSourcePropType;
    content?: string;
    phone?: string;
    targetAudience?: string;
    applyMethod?: string;
  };
  HealthMedical: undefined;
  HealthDetail: {
    title: string;
    organization: string;
    period: string;
    category: string;
    image: ImageSourcePropType;
    content?: string;
    phone?: string;
    targetAudience?: string;
    applyMethod?: string;
  };
  EducationCulture: undefined;
  EducationDetail: {
    title: string;
    organization: string;
    period: string;
    category: string;
    image: ImageSourcePropType;
    content?: string;
    phone?: string;
    targetAudience?: string;
    applyMethod?: string;
  };
  LifeConvenience: undefined;
  LifeConvenienceDetail: {
    title: string;
    organization: string;
    period: string;
    category: string;
    image: ImageSourcePropType;
    content?: string;
    phone?: string;
    targetAudience?: string;
    applyMethod?: string;
  };
  Notifications: undefined;
  MyListings: undefined;
  ListingForm: undefined;
  AdminListings: undefined;
  PartnerInfo: undefined;
  PartnerDetail: {
    title: string;
    service: string;
    category: string;
    image: ImageSourcePropType;
    location: string | null;
    address: string;
    phone: string;
    homepage: string | null;
    description: string | null;
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
