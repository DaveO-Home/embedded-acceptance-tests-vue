
<template>
  <div class="dodex--open">
    <img :src="'../images/dodex_g.ico'">
  </div>
</template>

<script>
import dodex from "dodex";
import input from "dodex-input";
import mess from "dodex-mess";

export default {
  name: "DodexC",
  mounted() {
    if (
      typeof testit === "undefined" ||
      (typeof testit !== "undefined" && !testit)
    ) {
      if (document.querySelector(".top--dodex") === null) {
        const server = window.location.hostname + (window.location.port.length > 0 ? ":" + window.location.port : "");
        // Content for cards A-Z and static card
        dodex.setContentFile("./dodex/data/content.js");
        dodex
          .init({
            width: 375,
            height: 200,
            left: "50%",
            top: "100px",
            input: input, // required if using frontend content load
            private: "full", // frontend load of private content, "none", "full", "partial"(only cards 28-52) - default none
            replace: true, // append to or replace default content - default false(append only)
            mess: mess,
            server: server
          })
          .then(function () {
            // Add in app/personal cards
            for (let i = 0; i < 3; i++) {
              dodex.addCard(getAdditionalContent());
            }
            /* Auto display of widget */
            // dodex.openDodex();
          });
      }
    }
  },
};

function getAdditionalContent() {
  return {
    cards: {
      card28: {
        tab: "F01999", // Only first 3 characters will show on the tab.
        front: {
          content: `<h1 style="font-size: 10px;">Friends</h1>
      <address style="width:385px">
        <strong>Charlie Brown</strong> 	111 Ace Ave. Pet Town
        <abbr title="phone"> : </abbr>555 555-1212<br>
        <abbr title="email" class="mr-1"></abbr><a href="mailto:cbrown@pets.com">cbrown@pets.com</a>
      </address>
      `,
        },
        back: {
          content: `<h1 style="font-size: 10px;">More Friends</h1>
      <address style="width:385px">
        <strong>Lucy</strong> 113 Ace Ave. Pet Town
        <abbr title="phone"> : </abbr>555 555-1255<br>
        <abbr title="email" class="mr-1"></abbr><a href="mailto:lucy@pets.com">lucy@pets.com</a>
      </address>
      `,
        },
      },
      card29: {
        tab: "F02",
        front: {
          content: "<h1 style=\"font-size: 14px;\">My New Card Front</h1>",
        },
        back: {
          content: "<h1 style=\"font-size: 14px;\">My New Card Back</h1>",
        },
      },
    },
  };
}
</script>
