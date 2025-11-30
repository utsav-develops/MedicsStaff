//Light Theme
export const lightTheme={
theme_bg : "#015BBB",
theme_fg : "#0F52BA",
theme_bg_three : "#FEFEFE",
theme_fg_three : "#FEFEFE",
theme_fg_two : "#202028",
theme_bg_two : "#202028",
dark: "#ffffff",


grey : "#808080",
lite_grey : "#f2f2f2",
text_grey : "#808080",
shadow_color : "#000",
btn_color : "#0F52BA",
icon_active_color : "#000",
icon_inactive_color : "#808080",
lite_bg : "#f2f2f2",
text_container_bg : "#FAF9F6",

//Status Colors
warning_background : "#ffeecc",
success_background : "#d6f5d6",
error_background : "#ffd6cc",
warning : "#e69900",
success : "#33cc33",
error : "#ff3300",
online_text : "#ffffff",


//medics Colors
medics_nurse_blue :  "#39B5E8",
medics_silver :  "#E9ECF2",
medics_soft_grey :  "#F8F8FB",
medics_grey :  "#808D9E",
medics_black :  "#1D1E25",
medics_blue : "#015BBB",
medics_green: "#009633",
medics_red: "#DD2509",
}

//Dark Theme
export const darkTheme ={
theme_bg : "#0B1623",
theme_fg : "#0F52BA",
theme_bg_three : "#0B1623",
theme_fg_three : "#f2f2f2",
theme_fg_two : "#f2f2f2",
theme_bg_two : "#f2f2f2",
theme : "#12243a",
dark: "#0B1623",

grey : "#808080",
lite_grey : "#f2f2f2",
text_grey : "#808080",
shadow_color : "#000",
btn_color : "#0F52BA",
icon_active_color : "#000",
icon_inactive_color : "#808080",
lite_bg : "#12243a",
text_container_bg : "#f2f2f2",

//Status Colors
warning_background : "#ffeecc",
success_background : "#d6f5d6",
error_background : "#ffd6cc",
warning : "#e69900",
success : "#33cc33",
error : "#ff3300",
online_text : "#ffffff",


//medics Colors
medics_nurse_blue :  "#39B5E8",
medics_silver :  "#E9ECF2",
medics_soft_grey :  "#F8F8FB",
medics_grey :  "#808D9E",
medics_black :  "#1D1E25",
medics_blue : "#015BBB",
medics_green: "#009633",
medics_red: "#DD2509",

  mapCustomStyle: [
    {
      elementType: "geometry",
      stylers: [{ color: "#000" }], // Use your desired color or theme variable here
    },
    {
      elementType: "labels.text.fill",
      stylers: [{ color: "#746855" }], // Use your desired color or theme variable here
    },
    {
      elementType: "labels.text.stroke",
      stylers: [{ color: "#242f3e" }], // Use your desired color or theme variable here
    },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }], // Use your desired color or theme variable here
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }], // Use your desired color or theme variable here
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }], // Use your desired color or theme variable here
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }], // Use your desired color or theme variable here
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }], // Use your desired color or theme variable here
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }], // Use your desired color or theme variable here
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }], // Use your desired color or theme variable here
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }], // Use your desired color or theme variable here
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }], // Use your desired color or theme variable here
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }], // Use your desired color or theme variable here
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }], // Use your desired color or theme variable here
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }], // Use your desired color or theme variable here
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }], // Use your desired color or theme variable here
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }], // Use your desired color or theme variable here
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }], // Use your desired color or theme variable here
    },
  ],
};
