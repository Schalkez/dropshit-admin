if [ -d /var/www/html/dropshit-admin ]; then
  rm -rf /var/www/html/dropshit-admin
fi

npm run build
mv dist /var/www/html/dropshit-admin