/**
 * Copyright 2025 paigehohman
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";

/**
 * `link-preview-card`
 *
 * @demo index.html
 * @element link-preview-card
 */
export class LinkPreviewCard extends DDDSuper(I18NMixin(LitElement)) {
  static get tag() {
    return "link-preview-card";
  }

  constructor() {
    super();
    this.title = "";
    this.description = "";
    this.href = "";
    this.image = "";
    this.link = "";
    this.loading = false;

    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/link-preview-card.ar.json", import.meta.url).href +
        "/../",
      locales: ["ar", "es", "hi", "zh"],
    });
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has("href")) {
      this.date = this.getData(this.href);
    }
  }

  async getData(link) {
    this.loading = true;
    const url = `https://open-apis.hax.cloud/api/services/website/metadata?q=${link}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      // console.log(json.data);
      // document.querySelector("#here").innerHTML = JSON.stringify(
      //   json.data,
      //   null,
      //   2
      // );
      // document.querySelector("#there").innerHTML = json.data["og:site_name"];
      console.log(this.data);
      this.title =
        json.data["og:title"] || json.data["title"] || "Not Available";
      this.description = json.data["description"] || "Not Available";
      this.image =
        this.image ||
        json.data["image"] ||
        json.data["logo"] ||
        json.data["og:image"] ||
        json.data["og:image"] ||
        "https://hax.psu.edu/" + json.data["og:image"] ||
        json.data["msapplication-TileImage"] ||
        json.data["msapplication-square310x310logo"] ||
        json.data["msapplication-TileImage"] ||
        json.data["ld+json"]["logo"] ||
        json.data["og:image"] ||
        "";
      this.link = json.data["url"] || link;
    } catch (error) {
      console.error("Error", error);
      this.title = "No Preview";
      this.description = "";
      this.image = "";
      this.link = "";
    } finally {
      this.loading = false;
    }
  }

  // getData(url) {
  //   return fetch("https://open-apis.hax.cloud/api/services/website/metadata?")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       this.data = data.data;
  //       this.loading = false;
  //       console.log(this.data);
  //       return data;
  //     });
  // }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      data: { type: Object },
      description: { type: String },
      href: { type: String },
      image: { type: String },
      link: { type: String },
      loading: { type: Boolean, reflect: true },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          color: var(--ddd-theme-primary);
          background-color: var(--ddd-theme-accent);
          font-family: var(--ddd-font-navigation);
          padding: var(--ddd-spacing-0);
          max-width: 400px;
          border-radius: var(--ddd-spacing-md);
          border: var(--ddd-border-xs);
        }
        .wrapper {
          margin: var(--ddd-spacing-2);
          padding: var(--ddd-spacing-4);
        }
        img {
          max-width: 100%;
          border-radius: var(--ddd-radius-md);
        }
        .title {
          font-weight: bold;
          color: var(--ddd-primary-2);
        }
        .loading-spinner {
          margin: var(--ddd-spacing-0);
          border: 8px solid #323ca8;
          width: 20px;
          height: 20px;
          animation: spin 3s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        h3 span {
          font-size: var(
            --link-preview-card-label-font-size,
            var(--ddd-font-size-s)
          );
        }
      `,
    ];
  }

  // Lit render the HTML
  render() {
    return html`
      <div class="wrapper" part="wrapper">
        ${this.loading
          ? html` <div class="loading-spinner" part="loading-spinner"></div> `
          : html`
              ${this.image
                ? html` <img
                    src="${this.image}"
                    alt="Preview Image"
                    alt=""
                    @error="${this.handleImageError}"
                    part="image"
                  />`
                : ""}
              <div class="content" part="content">
                <h3 class="title" part="title">${this.title}</h3>
                <details part="details"></details>
                <summary part="summary">Description</summary>
                <p class="desc" part="desc">${this.description}</p>
                <a href="${this.link}" target="_blank" class="url" part="url"
                  >Visit Site</a
                >
              </div>
            `}
      </div>
    `;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }
}

globalThis.customElements.define(LinkPreviewCard.tag, LinkPreviewCard);
