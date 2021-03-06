'use strict';

const templates = {
  articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
  tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
  authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
  tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
  authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML),
};

function titleClickHandler(event) {
  event.preventDefault();
  const clickedElement = this;
  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active');
  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active');
  }
  /* [DONE] add class 'active' to the clicked link */
  clickedElement.classList.add('active');
  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('.post');
  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active');
  }
  /* [DONE] get 'href' attribute from the clicked link */
  const articleSelector = clickedElement.getAttribute('href');
  /* [DONE] find the correct article using the selector (value of 'href' attribute) */
  const targetArticle = document.querySelector(articleSelector);
  /* [DONE] add class 'active' to the correct article */
  targetArticle.classList.add('active');
}


const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optTagsListSelector = '.tags.list',
  optCloudClassCount = '5',
  optCloudClassPrefix = 'tag-size-',
  optArticleAuthorSelector = '.post-author',
  optAuthorsListSelector = '.list.authors',
  optAuthorCloudClassPrefix = 'author-size-';


function generateTitleLinks(customSelector = '') {
  /* [DONE] remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
  /* [DONE] find all the articles and save them to variable: articles */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  let html = '';
  for (let article of articles) {
    /* [DONE] get the article id */
    const articleId = article.getAttribute('id');
    /* [DONE] find the title element, get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    /* [DONE] create HTML of the link */
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
    /* [DONE] insert link into titleList */
    html = html + linkHTML;
  }
  titleList.innerHTML = html;
  const links = document.querySelectorAll('.titles a');
  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}
generateTitleLinks();


function calculateTagsParams(tags) {
  const params = { max: 0, min: 999999 };
  for (let tag in tags) {
    if (tags[tag] > params.max) {
      params.max = tags[tag];
    }
    if (tags[tag] < params.min) {
      params.min = tags[tag];
    }
  }
  return params;
}

function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);

  return optCloudClassPrefix + classNumber;
}

function generateTags() {
  /* [DONE] create a new variable allTags with an empty object */
  let allTags = {};
  /* [DONE] find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* [DONE] START LOOP: for every article: */
  for (let article of articles) {
    /* [DONE] find tags wrapper */
    const tagsWrapper = article.querySelector(optArticleTagsSelector);
    /* [DONE] make html variable with empty string */
    let html = '';
    /* [DONE] get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /* [DONE] split tags into array */
    const articleTagsArray = articleTags.split(' ');
    /* [DONE] START LOOP: for each tag */
    for (let tag of articleTagsArray) {
      /* [DONE] generate HTML of the link */
      const tagsLinkHTMLData = {id: tag, title: tag};
      const tagsLinkHTML = templates.tagLink(tagsLinkHTMLData);
      /* [DONE] add generated code to html variable */
      html = html + tagsLinkHTML;
      /* [DONE] check if this link is NOT already in allTags */
      if (!allTags.hasOwnProperty(tag)) {
        /* [DONE] add generated code to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
      /* [DONE] END LOOP: for each tag */
    }
    /* [DONE] insert HTML of all the links into the tags wrapper */
    tagsWrapper.innerHTML = html;
    /* [DONE] END LOOP: for every article: */
  }
  /* [DONE] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);
  /* [DONE] create variable for all links HTML code */
  const tagsParams = calculateTagsParams(allTags);
  const allTagsData = {tags: []};
  /* [DONE] START LOOP: for each tag in allTags: */
  for (let tag in allTags) {
    /* [DONE] generate code of a link and add it to allTagsHTML */
    allTagsData.tags.push({
      tag: tag,
      count: allTags[tag],
      className: calculateTagClass(allTags[tag], tagsParams)
    });
  }
  /* [DONE] END LOOP: for each tag in allTags: */

  /* [DONE] add html from allTags to tagList */
  tagList.innerHTML = templates.tagCloudLink(allTagsData);
}
generateTags();


function tagClickHandler(event) {
  /* [DONE] prevent default action for this event */
  event.preventDefault();
  /* [DONE] make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* [DONE] make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* [DONE] make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* [DONE] find all tag links with class active */
  const activeTags = document.querySelectorAll('a.active[href^="#tag-"]');
  /* [DONE] START LOOP: for each active tag link */
  for (let activeTag of activeTags) {
    /* [DONE] remove class active */
    activeTag.classList.remove('active');
    /* [DONE] END LOOP: for each active tag link */
  }
  /* [DONE] find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks = document.querySelectorAll('a[href="' + href + '"]');
  /* [DONE] START LOOP: for each found tag link */
  for (let tagLink of tagLinks) {
    /* [DONE] add class active */
    tagLink.classList.add('active');
    /* [DONE] END LOOP: for each found tag link */
  }
  /* [DONE] execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags() {
  /* [DONE] find all links to tags */
  const allLinksToTags = document.querySelectorAll('a[href^="#tag-"]');
  /* [DONE] START LOOP: for each link */
  for (let link of allLinksToTags) {
    /* [DONE] add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler);
    /* [DONE] END LOOP: for each link */
  }
}
addClickListenersToTags();



function calculateAuthorsParams(authors) {
  const params = { max: 0, min: 999999 };
  for (let articleAuthor in authors) {
    params.max = Math.max(authors[articleAuthor], params.max);
    params.min = Math.min(authors[articleAuthor], params.min);
  }

  return params;
}


function calculateAuthorClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);

  return optAuthorCloudClassPrefix + classNumber;
}


function generateAuthors() {
  /* [DONE] create a new variable allAuthors with an empty object */
  let allAuthors = {};
  /* [DONE] find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* [DONE] START LOOP: for every article: */
  for (let article of articles) {
    /* [DONE] find authors wrapper */
    const authorWrapper = article.querySelector(optArticleAuthorSelector);
    /* [DONE] make html variable with empty string */
    let html = '';
    /* [DONE] get authors from authors attribute */
    const articleAuthor = article.getAttribute('data-author');
    /* [DONE] generate HTML of the link */
    const authorLinkHtmlData = {id: articleAuthor, title: articleAuthor};
    const authorLinkHtml = templates.authorLink(authorLinkHtmlData);
    /* [DONE] add generated code to html variable */
    html = html + authorLinkHtml;
    /* [DONE] add generated code to allAuthors object */
    if (!allAuthors.hasOwnProperty(articleAuthor)) {
      /* [DONE] add generated code to allAuthors object */
      allAuthors[articleAuthor] = 1;
    } else {
      allAuthors[articleAuthor]++;
    }
    /* [DONE] insert HTML of all the links into the authors wrapper */
    authorWrapper.innerHTML = html;
    /* [DONE] find list of authors in right column */
    const authorsList = document.querySelector(optAuthorsListSelector);
    /* [DONE] create variable for all links HTML code */
    const authorsParams = calculateAuthorsParams(allAuthors);
    const allAuthorsData = {authors: []};
    /* [DONE] START LOOP: for each authors in allAuthors: */
    for (let author in allAuthors) {
      /* [DONE] generate code of a link and add it to allAuthorsHTML */
      allAuthorsData.authors.push({
        author: author,
        count: allAuthors[author],
        className: calculateAuthorClass(allAuthors[author], authorsParams),
      });
    }
    /* [DONE] END LOOP: for each author in allAuthors: */
    /* [DONE] add html from allTAuthors to authorsList */
    authorsList.innerHTML = templates.authorCloudLink(allAuthorsData);
  }
}
generateAuthors();



function authorClickHandler(event) {
  /* [DONE] prevent default action for this event */
  event.preventDefault();
  /* [DONE] make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* [DONE] make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* [DONE] make a new constant "author" and extract author from the "href" constant */
  const author = href.replace('#author-', '');
  /* [DONE] find all authors links with class active */
  const authorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  /* [DONE] START LOOP: for each active authors link */
  for (let authorLink of authorLinks) {
    /* [DONE] remove class active */
    authorLink.classList.remove('active');
    /* [DONE] END LOOP: for each active authors link */
  }
  /* [DONE] find all authors links with "href" attribute equal to the "href" constant */
  const authorLinksHref = document.querySelectorAll('a[href="' + href + '"]');
  /* [DONE] START LOOP: for each found authors link */
  for (let authorLinkHref of authorLinksHref) {
    /* [DONE] add class active */
    authorLinkHref.classList.add('active');
    /* [DONE] END LOOP: for each found authors link */
  }
  /* [DONE] execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
}


function addClickListenersToAuthors() {
  /* [DONE] find all links to authors */
  const allLinksToAuthors = document.querySelectorAll('a[href^="#author-"]');
  /* [DONE] START LOOP: for each link */
  for (let link of allLinksToAuthors) {
    /* [DONE] add authorClickHandler as event listener for that link */
    link.addEventListener('click', authorClickHandler);
    /* [DONE] END LOOP: for each link */
  }
}
addClickListenersToAuthors();