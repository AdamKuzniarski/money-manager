import { useI18n } from "@/lib/use-i18n";

export function getSteps(translate) {
  
  return [
    {
      element: '[data-tour="introApp"]',
      popover: {
        title: translate("tour.intro.title"),
        description: translate("tour.intro.desc"),
        side: "top",
        align: "start"
      }
    },
    {
      element: '[data-tour="balance-summary"]',
      popover: {
        title: translate("tour.balance.title"),
        description: translate("tour.balance.desc"),
        side: "bottom",
        align: "start"
      }
    },
    {
      element: '[data-tour="filter-bar"]',
      popover: {
        title: translate("tour.filters.title"),
        description: translate("tour.filters.desc"),
        side: "top",
        align: "start"
      }
    },
    {
      element: '[data-tour="time-filter"]',
      popover: {
        title: translate("tour.timePresets.title"),
        description: translate("tour.timePresets.desc"),
        side: "right",
        align: "start"
      }
    },
    {
      element: '[data-tour="transactions-list"]',
      popover: {
        title: translate("tour.list.title"),
        description: translate("tour.list.desc"),
        side: "top",
        align: "start"
      }
    },
    {
      element: '[data-tour="nav-create"]',
      popover: {
        title: translate("tour.add.title"),
        description: translate("tour.add.desc"),
        side: "top",
        align: "center"
      }
    },
    {
      element: '[data-tour="nav-analytics"]',
      popover: {
        title: translate("tour.analytics.title"),
        description: translate("tour.analytics.desc"),
        side: "top",
        align: "center"
      }
    },
    {
      element: '[data-tour="per-page"]',
      popover: {
        title: translate("tour.perPage.title"),
        description: translate("tour.perPage.desc"),
        side: "bottom",
        align: "center"
      }
    },
    {
      element: '[data-tour="csv-export"]',
      popover: {
        title: translate("tour.csvExport.title"),
        description: translate("tour.csvExport.desc"),
        side: "bottom",
        align: "center"
      }
    },
    {
      element: '[data-tour="csv-import"]',
      popover: {
        title: translate("tour.csvImport.title"),
        description: translate("tour.csvImport.desc"),
        side: "bottom",
        align: "center"
      }
    },
    {
      element: '[data-tour="analytics-chart"]',
      popover: {
        title: translate("tour.chart.title"),
        description: translate("tour.chart.desc"),
        side: "bottom",
        align: "start"
      }
    }
  ];
}
