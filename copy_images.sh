#!/bin/bash
BRAIN_DIR="/Users/monit/.gemini/antigravity-ide/brain/c1db82d3-80d1-4a1b-9e9f-f48db938f1d9"
PUB_DIR="public/images"

# 1. Botanical Hero
for file in hero/home/home-hero-01.jpg hero/home/home-hero-04.jpg hero/shop/shop-hero.jpg hero/shop/shop-hero-01.jpg lifestyle/home-hero.jpg; do
  cp "$BRAIN_DIR"/home_hero_botanical_*.jpg "$PUB_DIR/$file"
done

# 2. Skincare Flatlay
for file in hero/home/home-hero-02.jpg hero/home/home-hero-06.jpg categories/personal-care.jpg lifestyle/promo-banner.jpg social/social-3.jpg hero/shop/shop-hero-02.jpg categories/mosquito-protection.jpg; do
  cp "$BRAIN_DIR"/skincare_flatlay_*.jpg "$PUB_DIR/$file"
done

# 3. Herbal Mortar
for file in hero/home/home-hero-03.jpg lifestyle/brand-story.jpg lifestyle/our-story.jpg hero/shop/shop-hero-03.jpg categories/kitchen-essentials.jpg lifestyle/thoughtful-2.jpg; do
  cp "$BRAIN_DIR"/herbal_mortar_*.jpg "$PUB_DIR/$file"
done

# 4. Clean Interior
for file in hero/contact/contact-hero.jpg hero/contact/contact-01.jpg hero/contact/contact-02.jpg hero/contact/contact-03.jpg hero/partner/partner-hero.jpg hero/partner/partner-01.jpg hero/partner/partner-02.jpg hero/partner/partner-03.jpg lifestyle/contact-hero.jpg lifestyle/partner-hero.jpg social/social-2.jpg social/social-5.jpg; do
  cp "$BRAIN_DIR"/clean_interior_*.jpg "$PUB_DIR/$file"
done

# 5. Farm Harvest
for file in hero/why-tanush/why-tanush-hero.jpg hero/why-tanush/why-tanush-01.jpg hero/why-tanush/why-tanush-02.jpg hero/why-tanush/why-tanush-03.jpg lifestyle/why-tanush-hero.jpg; do
  cp "$BRAIN_DIR"/farm_harvest_*.jpg "$PUB_DIR/$file"
done

# 6. Macro Leaf
for file in hero/home/home-hero-05.jpg categories/more.jpg lifestyle/thoughtful-1.jpg lifestyle/thoughtful-3.jpg lifestyle/collage-sub1.jpg lifestyle/collage-sub2.jpg; do
  cp "$BRAIN_DIR"/macro_leaf_*.jpg "$PUB_DIR/$file"
done

# 7. Organic Lifestyle
for file in social/social-1.jpg social/social-4.jpg lifestyle/thoughtful-4.jpg lifestyle/collage-main.jpg; do
  cp "$BRAIN_DIR"/organic_lifestyle_*.jpg "$PUB_DIR/$file"
done

# 8. Sustainable Home
for file in categories/home-care.jpg; do
  cp "$BRAIN_DIR"/sustainable_home_*.jpg "$PUB_DIR/$file"
done

echo "Images replaced successfully!"
