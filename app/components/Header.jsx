import {Suspense, useEffect} from 'react';
import {Await, NavLink, useAsyncValue, useLocation} from '@remix-run/react';
import {useAnalytics, useOptimisticCart} from '@shopify/hydrogen';
import {useAside} from '~/components/Aside';
import useWidth from '../Hooks/useWidth';
import useScrollY from '../Hooks/useScrollY';
import cn from 'classnames';
// import {useLocation} from 'react-router';
/**
 * @param {HeaderProps}
 */
export function Header({header, isLoggedIn, cart, publicStoreDomain}) {
  const {shop, menu} = header;
  const width = useWidth();
  const useScroll = useScrollY();
  const location = useLocation();
  const currentPath = location.pathname;
  useEffect(() => {}, [currentPath]);
  return (
    <header
      className={cn('header', {
        header_alt: useScroll !== 0,
        not_home: currentPath !== '/',
      })}
    >
      {/* left */}
      <div className="nav-left-container">
        <HeaderMenu
          menu={menu}
          viewport="desktop"
          primaryDomainUrl={header.shop.primaryDomain.url}
          publicStoreDomain={publicStoreDomain}
        />
        <div className="is-mobile">
          <HeaderMenuMobileToggle />
          <SearchToggle />
        </div>
      </div>
      {/* center */}
      <div className="shop-name-container">
        <NavLink
          prefetch="intent"
          to="/"
          className={cn('header-shop-title', {
            shop_title_alt: useScroll !== 0,
            not_home_title: currentPath !== '/',
          })}
          end
        >
          {shop.name}
          {/* {width <= 749 ? 'CTL' : shop.name} */}
        </NavLink>
      </div>
      {/* right */}

      <div className="nav-right-container">
        <HeaderCtas isLoggedIn={isLoggedIn} cart={cart} />
      </div>
    </header>
  );
}

/**
 * @param {{
 *   menu: HeaderProps['header']['menu'];
 *   primaryDomainUrl: HeaderProps['header']['shop']['primaryDomain']['url'];
 *   viewport: Viewport;
 *   publicStoreDomain: HeaderProps['publicStoreDomain'];
 * }}
 */
export function HeaderMenu({
  menu,
  primaryDomainUrl,
  viewport,
  publicStoreDomain,
}) {
  const useScroll = useScrollY();
  const location = useLocation();
  const currentPath = location.pathname;
  const className = `header-menu-${viewport}`;
  const {close} = useAside();

  function closeAside(event) {
    if (viewport === 'mobile') {
      event.preventDefault();
      window.location.href = event.currentTarget.href;
    }
  }
  return (
    <nav className={className} role="navigation">
      {viewport === 'mobile' && (
        <NavLink
          end
          onClick={close}
          prefetch="intent"
          // style={activeLinkStyle}
          to="/"
          className="mobile-home-link"
        >
          HOME
        </NavLink>
      )}
      {(menu || FALLBACK_HEADER_MENU).items.map((item) => {
        if (!item.url) return null;

        // if the url is internal, we strip the domain
        const url =
          item.url.includes('myshopify.com') ||
          item.url.includes(publicStoreDomain) ||
          item.url.includes(primaryDomainUrl)
            ? new URL(item.url).pathname
            : item.url;
        return (
          <NavLink
            className={cn('header-link header-menu-item', {
              scrolled_header_link: useScroll !== 0,
              not_home_item: currentPath !== '/',
            })}
            end
            key={item.id}
            onClick={close}
            prefetch="intent"
            // style={activeLinkStyle}
            to={url}
          >
            {item.title}
          </NavLink>
        );
      })}
    </nav>
  );
}

/**
 * @param {Pick<HeaderProps, 'isLoggedIn' | 'cart'>}
 */
function HeaderCtas({isLoggedIn, cart}) {
  const useScroll = useScrollY();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="header-ctas" role="navigation">
      {/* <HeaderMenuMobileToggle /> */}
      <NavLink
        prefetch="intent"
        to="/account"
        className={cn('header-link sign-in-nav nav-icon', {
          scrolled_header_link: useScroll !== 0,
          scrolled_sign_in_nav: useScroll !== 0,
          not_home_sign_in: currentPath !== '/',
        })}
      >
        <Suspense fallback="Sign in">
          <Await resolve={isLoggedIn} errorElement="Sign in">
            {/* {(isLoggedIn) => (isLoggedIn ? 'Account' : 'Sign in')} */}
          </Await>
        </Suspense>
      </NavLink>
      <div className="is-desktop">
        <SearchToggle />
      </div>

      <CartToggle cart={cart} />
    </nav>
  );
}

function HeaderMenuMobileToggle() {
  // const {open} = useAside();
  // return (
  //   <button
  //     className="header-menu-mobile-toggle reset"
  //     onClick={() => open('mobile')}
  //   >
  //     <h3>☰</h3>
  //   </button>
  // );

  const {open} = useAside();
  const location = useLocation();
  const currentPath = location.pathname;
  const useScroll = useScrollY();

  return (
    <a
      className="header-menu-mobile-toggle"
      href="#mobile-menu-aside"
      onClick={() => open('mobile')}
    >
      <h3
        className={cn('mobile-hamburger', {
          scrolled_ham: useScroll !== 0,
          not_home_ham: currentPath !== '/',
        })}
      >
        ☰
      </h3>
    </a>
  );
}

function SearchToggle() {
  const {open} = useAside();
  const location = useLocation();
  const currentPath = location.pathname;
  const useScroll = useScrollY();
  return (
    <a
      className={cn('header-link nav-search nav-icon', {
        scrolled_header_link: useScroll !== 0,
        scrolled_search_nav: useScroll !== 0,
        not_home_search: currentPath !== '/',
      })}
      onClick={() => open('search')}
    ></a>
  );
  return (
    <a
      className={cn('header-link nav-search nav-icon', {
        scrolled_header_link: useScroll !== 0,
        scrolled_search_nav: useScroll !== 0,
        not_home_search: currentPath !== '/',
      })}
      href="#search-aside"
    ></a>
  );
}

/**
 * @param {{count: number | null}}
 */
function CartBadge({count}) {
  const location = useLocation();
  const currentPath = location.pathname;
  const useScroll = useScrollY();
  const {publish, shop, cart, prevCart} = useAnalytics();
  const {open} = useAside();

  return (
    // <a
    //   href="/cart"
    //   onClick={(e) => {
    //     e.preventDefault();
    //     open('cart');
    //     publish('cart_viewed', {
    //       cart,
    //       prevCart,
    //       shop,
    //       url: window.location.href || '',
    //     });
    //   }}
    // >
    //   {' '}
    //   Cart {count === null ? <span>&nbsp;</span> : count}
    // </a>
    <div>
      <a
        id="nav-bag"
        className={cn('header-link bag-container', {
          scrolled_header_link: useScroll !== 0,
        })}
        href="/cart"
        onClick={(e) => {
          e.preventDefault();
          open('cart');
          publish('cart_viewed', {
            cart,
            prevCart,
            shop,
            url: window.location.href || '',
          });
        }}
      >
        <div
          className={cn('bag-count', {
            scrolled_bag_count: useScroll !== 0,
            not_home_bag_count: currentPath !== '/',
          })}
        >
          {count}
        </div>
        <p
          className={cn('nav-icon nav-bag', {
            scrolled_bag_nav: useScroll !== 0,
            not_home_bag: currentPath !== '/',
          })}
        ></p>
      </a>
    </div>
  );
  // <a href="#cart-aside">Cart {count}</a>;
  // const {publish, shop, cart, prevCart} = useAnalytics();
  // const {open} = useAside();

  // return (
  //   <a
  //     href="/cart"
  //     onClick={(e) => {
  //       e.preventDefault();
  //       open('cart');
  //       publish('cart_viewed', {
  //         cart,
  //         prevCart,
  //         shop,
  //         url: window.location.href || '',
  //       });
  //     }}
  //   >
  //     Cart {count === null ? <span>&nbsp;</span> : count}
  //   </a>
  // );
}

/**
 * @param {Pick<HeaderProps, 'cart'>}
 */
function CartToggle({cart}) {
  return (
    <Suspense fallback={<CartBadge count={0} />}>
      <Await resolve={cart}>
        {(cart) => {
          if (!cart) return <CartBadge count={0} />;
          return <CartBadge count={cart.totalQuantity || 0} />;
        }}
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue();
  const cart = useOptimisticCart(originalCart);
  return <CartBadge count={cart?.totalQuantity ?? 0} />;
}

const FALLBACK_HEADER_MENU = {
  id: 'gid://shopify/Menu/199655587896',
  items: [
    {
      id: 'gid://shopify/MenuItem/461609500728',
      resourceId: null,
      tags: [],
      title: 'Collections',
      type: 'HTTP',
      url: '/collections',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609533496',
      resourceId: null,
      tags: [],
      title: 'Blog',
      type: 'HTTP',
      url: '/blogs/journal',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609566264',
      resourceId: null,
      tags: [],
      title: 'Policies',
      type: 'HTTP',
      url: '/policies',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461609599032',
      resourceId: 'gid://shopify/Page/92591030328',
      tags: [],
      title: 'About',
      type: 'PAGE',
      url: '/pages/about',
      items: [],
    },
  ],
};

/**
 * @param {{
 *   isActive: boolean;
 *   isPending: boolean;
 * }}
 */
function activeLinkStyle({isActive, isPending}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'black',
  };
}

/** @typedef {'desktop' | 'mobile'} Viewport */
/**
 * @typedef {Object} HeaderProps
 * @property {HeaderQuery} header
 * @property {Promise<CartApiQueryFragment|null>} cart
 * @property {Promise<boolean>} isLoggedIn
 * @property {string} publicStoreDomain
 */

/** @typedef {import('@shopify/hydrogen').CartViewPayload} CartViewPayload */
/** @typedef {import('storefrontapi.generated').HeaderQuery} HeaderQuery */
/** @typedef {import('storefrontapi.generated').CartApiQueryFragment} CartApiQueryFragment */
