/* =========================================================
   BOOK DATABASE
========================================================= */

const books = [

    {
        id: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        price: 399,
        old: 599,
        rating: 4.9,
        category: "Business",
        tag: "Reader Pick",
        description:
            "Timeless lessons on wealth, greed, happiness and making better money decisions.",
        newest: 11
    },

    {
        id: 5,
        title: "Ikigai",
        author: "Héctor García & Francesc Miralles",
        price: 349,
        old: 450,
        rating: 4.6,
        category: "Self-help",
        tag: "",
        isbn: "9780143130727",
        description:
            "A practical exploration of the Japanese concept of a meaningful life.",
        newest: 6
    },

    {
        id: 6,
        title: "The Alchemist",
        author: "Paulo Coelho",
        price: 299,
        old: 399,
        rating: 4.8,
        category: "Fiction",
        tag: "Classic",
        isbn: "9780062315007",
        description:
            "A young shepherd follows his dreams in a timeless tale about finding one's purpose.",
        newest: 5
    },

    {
        id: 7,
        title: "Deep Work",
        author: "Cal Newport",
        price: 529,
        old: 699,
        rating: 4.7,
        category: "Business",
        tag: "",
        isbn: "9781455586691",
        description:
            "Rules for focused success in a distracted world.",
        newest: 12
    },

    {
        id: 8,
        title: "The Midnight Library",
        author: "Matt Haig",
        price: 449,
        old: 599,
        rating: 4.6,
        category: "Fiction",
        tag: "New",
        isbn: "9780525559474",
        description:
            "Between life and death there is a library, and within that library, another life.",
        newest: 15
    },

    {
        id: 9,
        title: "Think Like a Monk",
        author: "Jay Shetty",
        price: 499,
        old: 699,
        rating: 4.7,
        category: "Self-help",
        tag: "",
        isbn: "9781982134488",
        description:
            "Train your mind for peace and purpose every day.",
        newest: 13
    },

    {
        id: 10,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        price: 399,
        old: 499,
        rating: 4.9,
        category: "Children",
        tag: "Classic",
        isbn: "9780547928227",
        description:
            "An unforgettable adventure through Middle-earth.",
        newest: 7
    },

    {
        id: 11,
        title: "Rich Dad Poor Dad",
        author: "Robert T. Kiyosaki",
        price: 449,
        old: 599,
        rating: 4.7,
        category: "Business",
        tag: "Bestseller",
        isbn: "9781612680194",
        description:
            "What the rich teach their kids about money that the poor and middle class do not.",
        newest: 4
    },

    {
        id: 12,
        title: "The Little Prince",
        author: "Antoine de Saint-Exupéry",
        price: 299,
        old: 399,
        rating: 4.9,
        category: "Children",
        tag: "Classic",
        isbn: "9780156012195",
        description:
            "A beloved philosophical tale about friendship, love and seeing with the heart.",
        newest: 3
    }

];



/* =========================================================
   APPLICATION STATE
========================================================= */

let state = {

    category: "All",

    search: "",

    sort: "featured",

    shown: 8,

    cart:
        JSON.parse(
            localStorage.getItem("booknest-cart") || "[]"
        ),

    wishlist:
        JSON.parse(
            localStorage.getItem("booknest-wishlist") || "[]"
        )

};



/* =========================================================
   HELPERS
========================================================= */

const $ = selector =>
    document.querySelector(selector);


function money(number) {

    return "₹" +
        number.toLocaleString("en-IN");

}


function cover(isbn) {

    return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;

}



/* =========================================================
   LOCAL STORAGE
========================================================= */

function saveState() {

    localStorage.setItem(
        "booknest-cart",
        JSON.stringify(state.cart)
    );

    localStorage.setItem(
        "booknest-wishlist",
        JSON.stringify(state.wishlist)
    );

    updateBadges();

}



/* =========================================================
   BADGES
========================================================= */

function updateBadges() {

    const cartQuantity =
        state.cart.reduce(
            (total, item) =>
                total + item.qty,
            0
        );

    $("#cartCount").textContent =
        cartQuantity;

    $("#wishlistCount").textContent =
        state.wishlist.length;

}



/* =========================================================
   FILTER BOOKS
========================================================= */

function filteredBooks() {

    let result = books.filter(book => {

        const matchesCategory =
            state.category === "All" ||
            book.category === state.category;


        const searchable =
            `
            ${book.title}
            ${book.author}
            ${book.category}
            `.toLowerCase();


        const matchesSearch =
            searchable.includes(
                state.search.toLowerCase()
            );


        return (
            matchesCategory &&
            matchesSearch
        );

    });


    /* SORT */

    if (state.sort === "price-low") {

        result.sort(
            (a,b) =>
                a.price - b.price
        );

    }


    if (state.sort === "price-high") {

        result.sort(
            (a,b) =>
                b.price - a.price
        );

    }


    if (state.sort === "rating") {

        result.sort(
            (a,b) =>
                b.rating - a.rating
        );

    }


    if (state.sort === "newest") {

        result.sort(
            (a,b) =>
                b.newest - a.newest
        );

    }


    return result;

}



/* =========================================================
   PRODUCT CARD
========================================================= */

function productCard(book) {

    const wished =
        state.wishlist.includes(book.id);


    return `

        <article class="product-card">

            <div
                class="cover"
                data-view="${book.id}">

                ${
                    book.tag
                    ?
                    `
                    <span class="tag">
                        ${book.tag}
                    </span>
                    `
                    :
                    ""
                }


                <button
                    class="heart ${wished ? "active" : ""}"
                    data-wish="${book.id}"
                    aria-label="Wishlist">

                    ${wished ? "♥" : "♡"}

                </button>


                <img
                    src="${cover(book.isbn)}"
                    alt="${book.title}"
                    loading="lazy"
                    onerror="
                        this.src=
                        'https://placehold.co/500x700/e8d9c6/5b4635?text=Book'
                    "
                >

            </div>


            <h3>
                ${book.title}
            </h3>


            <p class="author">
                ${book.author}
            </p>


            <div class="rating">

                <span>
                    ★★★★★
                </span>

                ${book.rating}

            </div>


            <div class="price">

                <strong>
                    ${money(book.price)}
                </strong>

                <del>
                    ${money(book.old)}
                </del>

            </div>


            <button
                class="add-cart"
                data-cart="${book.id}">

                Add to cart

            </button>

        </article>

    `;

}



/* =========================================================
   RENDER PRODUCTS
========================================================= */

function renderProducts() {

    const list =
        filteredBooks();


    $("#productGrid").innerHTML =

        list
            .slice(0, state.shown)
            .map(productCard)
            .join("");


    if (!list.length) {

        $("#productGrid").innerHTML = `

            <div
                style="
                grid-column:1/-1;
                text-align:center;
                padding:50px;
                color:var(--muted);
                ">

                No books found.
                <br>
                Try another search.

            </div>

        `;

    }


    $("#loadMore").style.display =

        state.shown < list.length
        ?
        "inline-flex"
        :
        "none";


    bindCards();

}



/* =========================================================
   CARD EVENTS
========================================================= */

function bindCards() {

    document
        .querySelectorAll("[data-cart]")
        .forEach(button => {

            button.onclick = () => {

                addCart(
                    Number(button.dataset.cart)
                );

            };

        });


    document
        .querySelectorAll("[data-wish]")
        .forEach(button => {

            button.onclick = event => {

                event.stopPropagation();

                toggleWish(
                    Number(button.dataset.wish)
                );

            };

        });


    document
        .querySelectorAll("[data-view]")
        .forEach(card => {

            card.onclick = () => {

                openBook(
                    Number(card.dataset.view)
                );

            };

        });

}



/* =========================================================
   CART
========================================================= */

function addCart(id) {

    const existing =
        state.cart.find(
            item =>
                item.id === id
        );


    if (existing) {

        existing.qty++;

    } else {

        state.cart.push({

            id: id,

            qty: 1

        });

    }


    saveState();

    renderCart();

    openDrawer();

}



function changeQty(id, amount) {

    const item =
        state.cart.find(
            x => x.id === id
        );


    if (!item) return;


    item.qty += amount;


    if (item.qty <= 0) {

        state.cart =
            state.cart.filter(
                x => x.id !== id
            );

    }


    saveState();

    renderCart();

}



function removeCart(id) {

    state.cart =
        state.cart.filter(
            item =>
                item.id !== id
        );


    saveState();

    renderCart();

}



/* =========================================================
   RENDER CART
========================================================= */

function renderCart() {

    const container =
        $("#cartItems");


    if (!state.cart.length) {

        container.innerHTML = `

            <div
                style="
                text-align:center;
                padding:70px 10px;
                color:var(--muted);
                ">

                Your cart is waiting
                for a good story. 📚

            </div>

        `;


        $("#cartSubtotal").textContent =
            "₹0";

        return;

    }


    container.innerHTML =

        state.cart
            .map(item => {

                const book =
                    books.find(
                        b => b.id === item.id
                    );


                return `

                    <div class="cart-row">

                        <img
                            src="${cover(book.isbn)}"
                            alt="${book.title}"
                        >


                        <div>

                            <h4>
                                ${book.title}
                            </h4>

                            <small>
                                ${money(book.price)}
                            </small>


                            <div class="qty">

                                <button
                                    data-dec="${book.id}">
                                    −
                                </button>

                                <span>
                                    ${item.qty}
                                </span>

                                <button
                                    data-inc="${book.id}">
                                    +
                                </button>

                            </div>

                        </div>


                        <span
                            class="remove"
                            data-remove="${book.id}">

                            Remove

                        </span>

                    </div>

                `;

            })
            .join("");


    const total =
        state.cart.reduce(
            (sum,item) => {

                const book =
                    books.find(
                        b =>
                            b.id === item.id
                    );

                return (
                    sum +
                    book.price *
                    item.qty
                );

            },
            0
        );


    $("#cartSubtotal").textContent =
        money(total);


    container
        .querySelectorAll("[data-inc]")
        .forEach(button => {

            button.onclick = () => {

                changeQty(
                    Number(button.dataset.inc),
                    1
                );

            };

        });


    container
        .querySelectorAll("[data-dec]")
        .forEach(button => {

            button.onclick = () => {

                changeQty(
                    Number(button.dataset.dec),
                    -1
                );

            };

        });


    container
        .querySelectorAll("[data-remove]")
        .forEach(button => {

            button.onclick = () => {

                removeCart(
                    Number(button.dataset.remove)
                );

            };

        });

}



/* =========================================================
   WISHLIST
========================================================= */

function toggleWish(id) {

    if (
        state.wishlist.includes(id)
    ) {

        state.wishlist =
            state.wishlist.filter(
                x => x !== id
            );

    } else {

        state.wishlist.push(id);

    }


    saveState();

    renderProducts();

    renderBest();

}



/* =========================================================
   CART DRAWER
========================================================= */

function openDrawer() {

    $("#cartDrawer")
        .classList.add("open");

    $("#overlay")
        .classList.add("show");

}


function closeDrawer() {

    $("#cartDrawer")
        .classList.remove("open");

    $("#overlay")
        .classList.remove("show");

}



/* =========================================================
   BOOK DETAILS
========================================================= */

function openBook(id) {

    const book =
        books.find(
            b => b.id === id
        );


    $("#modalContent").innerHTML = `

        <div class="modal-book">

            <img
                src="${cover(book.isbn)}"
                alt="${book.title}"
            >


            <div>

                <span class="eyebrow">
                    ${book.category}
                </span>


                <h2>
                    ${book.title}
                </h2>


                <p class="author">
                    ${book.author}
                </p>


                <div class="rating">

                    <span>
                        ★★★★★
                    </span>

                    ${book.rating}/5

                </div>


                <p class="desc">
                    ${book.description}
                </p>


                <ul class="detail-list">

                    <li>
                        ISBN:
                        ${book.isbn}
                    </li>

                    <li>
                        Format:
                        Paperback
                    </li>

                    <li>
                        Language:
                        English
                    </li>

                    <li>
                        Delivery:
                        2–5 business days
                    </li>

                </ul>


                <div
                    class="price"
                    style="margin:20px 0">

                    <strong>
                        ${money(book.price)}
                    </strong>

                    <del>
                        ${money(book.old)}
                    </del>

                </div>


                <button
                    class="btn btn-dark"
                    onclick="
                        addCart(${book.id});
                        document
                            .querySelector('#bookModal')
                            .classList
                            .remove('show');
                    ">

                    Add to cart →

                </button>

            </div>

        </div>

    `;


    $("#bookModal")
        .classList.add("show");

}



/* =========================================================
   BESTSELLERS
========================================================= */

function renderBest() {

    const bestsellers =

        books
            .slice()
            .sort(
                (a,b) =>
                    b.rating - a.rating
            )
            .slice(0,5);


    $("#bestsellerGrid").innerHTML =

        bestsellers
            .map(book => `

                <article class="mini-card">

                    <div
                        class="cover"
                        data-view="${book.id}">

                        <img
                            src="${cover(book.isbn)}"
                            alt="${book.title}"
                            loading="lazy"
                        >

                    </div>


                    <h3>
                        ${book.title}
                    </h3>


                    <p>
                        ${book.author}
                    </p>


                    <strong>
                        ${money(book.price)}
                    </strong>

                </article>

            `)
            .join("");


    document
        .querySelectorAll(
            "#bestsellerGrid [data-view]"
        )
        .forEach(card => {

            card.onclick = () => {

                openBook(
                    Number(card.dataset.view)
                );

            };

        });

}



/* =========================================================
   MOBILE MENU
========================================================= */

$("#mobileMenu").onclick = () => {

    $("#mainNav")
        .classList
        .toggle("open");

};



/* =========================================================
   SEARCH
========================================================= */

$("#searchBtn").onclick = () => {

    $("#searchPanel")
        .classList
        .toggle("open");

    $("#searchInput").focus();

};


$("#closeSearch").onclick = () => {

    $("#searchPanel")
        .classList
        .remove("open");

};


$("#searchInput").oninput = event => {

    state.search =
        event.target.value;

    state.shown = 8;

    renderProducts();

};



/* =========================================================
   SORT
========================================================= */

$("#sortSelect").onchange = event => {

    state.sort =
        event.target.value;

    state.shown = 8;

    renderProducts();

};



/* =========================================================
   LOAD MORE
========================================================= */

$("#loadMore").onclick = () => {

    state.shown += 4;

    renderProducts();

};



/* =========================================================
   CART BUTTON
========================================================= */

$("#cartBtn").onclick = () => {

    renderCart();

    openDrawer();

};


$("#closeCart").onclick =
    closeDrawer;


$("#overlay").onclick =
    closeDrawer;



/* =========================================================
   BOOK MODAL
========================================================= */

$("#modalClose").onclick = () => {

    $("#bookModal")
        .classList
        .remove("show");

};


$("#bookModal").onclick = event => {

    if (
        event.target.id ===
        "bookModal"
    ) {

        $("#bookModal")
            .classList
            .remove("show");

    }

};



/* =========================================================
   DARK MODE
========================================================= */

$("#themeToggle").onclick = () => {

    document.body
        .classList
        .toggle("dark");


    localStorage.setItem(

        "booknest-theme",

        document.body
            .classList
            .contains("dark")
            ?
            "dark"
            :
            "light"

    );

};


if (
    localStorage.getItem(
        "booknest-theme"
    ) === "dark"
) {

    document.body
        .classList
        .add("dark");

}



/* =========================================================
   CATEGORIES
========================================================= */

document
    .querySelectorAll(".category-card")
    .forEach(button => {

        button.onclick = () => {

            document
                .querySelectorAll(
                    ".category-card"
                )
                .forEach(card => {

                    card.classList
                        .remove("active");

                });


            button.classList
                .add("active");


            state.category =
                button.dataset.category;

            state.shown = 8;

            renderProducts();


            document
                .querySelector("#shop")
                .scrollIntoView({
                    behavior: "smooth"
                });

        };

    });



/* =========================================================
   NEWSLETTER
========================================================= */

$("#newsletterForm").onsubmit = event => {

    event.preventDefault();


    $("#formMessage")
        .textContent =
        "Thanks! Check your inbox for a welcome note.";


    $("#emailInput")
        .value = "";

};



/* =========================================================
   CHECKOUT
========================================================= */

$("#checkoutBtn").onclick = () => {

    if (!state.cart.length) {

        alert(
            "Your cart is empty."
        );

        return;

    }


    alert(
        "Checkout is ready to connect to your payment gateway."
    );

};



/* =========================================================
   INITIALIZE WEBSITE
========================================================= */

renderProducts();

renderBest();

renderCart();

updateBadges();        isbn: "9780857197689",
        old: 499,
        author: "Morgan Housel",
        price: 499,
        id: 4,
        title: "The Psychology of Money",
            "A sweeping history of humankind from the Stone Age to the modern age.",
        newest: 8

    {
    },
        rating: 4.8,
        category: "Fiction",
        isbn: "9780062316097",
        description:
        category: "Non-fiction",
        tag: "Popular",
        tag: "Classic",
        isbn: "9780141182636",
        description:
        price: 549,
        old: 699,
        rating: 4.8,
            "A dazzling portrait of the Jazz Age, ambition, love and the American dream.",
        id: 3,
        title: "Sapiens",
        author: "Yuval Noah Harari",
        newest: 10
    {
    },


    },
        author: "James Clear",
        tag: "Bestseller",
        isbn: "9780735211292",
        newest: 9
        description:
            "An easy and proven way to build good habits and break bad ones.",
        price: 599,
        category: "Self-help",
        old: 799,
        rating: 4.9,
    {
        id: 2,
