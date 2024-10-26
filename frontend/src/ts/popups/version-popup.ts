import format from "date-fns/format";
import { getReleasesFromGitHub } from "../utils/misc";

export function show(): void {
  $("#versionHistory").html(`
    <div class="preloader">
      <i class="fas fa-fw fa-spin fa-circle-notch"></i>
    </div
  `);
  getReleasesFromGitHub().then((releases) => {
    $("#versionHistory").html(`<div class="releases"></div`);
    releases.forEach((release: MonkeyTypes.GithubRelease) => {
      if (!release.draft && !release.prerelease) {
        $("#versionHistory .releases").append(`
        <div class="release">
          <div class="title">${release.name}</div>
          <div class="date">${format(
            new Date(release.published_at),
            "dd MMM yyyy"
          )}</div>
          <div class="body">${release.body.replace(/\r\n/g, "<br>")}</div>
        </div>
      `);
      }
    });
  });
  $("#versionHistoryWrapper")
    .css("opacity", 0)
    .removeClass("hidden")
    .animate({ opacity: 1 }, 125);
  $("#newVersionIndicator").addClass("hidden");
}

function hide(): void {
  $("#versionHistoryWrapper")
    .css("opacity", 1)
    .animate({ opacity: 0 }, 125, () => {
      $("#versionHistoryWrapper").addClass("hidden");
      $("#versionHistory").html("");
    });
}

$("#bottom").on("click", "#newVersionIndicator", () => {
  $("#newVersionIndicator").addClass("hidden");
});

$("#bottom").on("click", ".version", (e) => {
  if (e.shiftKey) return;
  show();
});

$("#popups").on("click", "#versionHistoryWrapper", (e) => {
  if ($(e.target).attr("id") === "versionHistoryWrapper") {
    hide();
  }
});

$(document).on("keydown", (event) => {
  if (
    event.key === "Escape" &&
    !$("#versionHistoryWrapper").hasClass("hidden")
  ) {
    hide();
    event.preventDefault();
  }
});