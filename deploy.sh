if [ -d /var/www/html/dropshit-admin/dist ]; then
  rm -rf /var/www/html/dropshit-admin/dist
fi

npm run build
mv dist /var/www/html/dropshit-admin