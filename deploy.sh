if [ -d /var/www/html/dropship-admin/dist ]; then
  rm -rf /var/www/html/dropship-admin/dist
fi

npm run build
mv dist /var/www/html/dropship-admin