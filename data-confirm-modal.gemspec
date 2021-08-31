# -*- encoding: utf-8 -*-
# stub: data-confirm-modal 1.6.3 ruby lib

Gem::Specification.new do |s|
  s.name = "data-confirm-modal".freeze
  s.version = "1.6.4"

  s.required_rubygems_version = Gem::Requirement.new(">= 1.3.6".freeze) if s.respond_to? :required_rubygems_version=
  s.require_paths = ["lib".freeze]
  s.authors = ["Marcello Barnaba".freeze]
  s.date = "2021-08-31"
  s.description = "This gem overrides Rails' UJS behaviour to open up a Bootstrap Modal instead of the browser's built in confirm() dialog".freeze
  s.email = ["vjt@openssl.it".freeze]
  s.files = [".gitignore".freeze, ".npmignore".freeze, "Gemfile".freeze, "LICENSE".freeze, "README.md".freeze, "Rakefile".freeze, "bower.json".freeze, "data-confirm-modal.gemspec".freeze, "lib/data-confirm-modal.rb".freeze, "lib/data-confirm-modal/engine.rb".freeze, "lib/data-confirm-modal/version.rb".freeze, "package.json".freeze, "vendor/assets/javascripts/data-confirm-modal.js".freeze]
  s.homepage = "http://github.com/ifad/data-confirm-modal".freeze
  s.licenses = ["MIT".freeze]
  s.rubygems_version = "3.2.15".freeze
  s.summary = "Use bootstrap modals with Rails' UJS data-confirm".freeze

  s.installed_by_version = "3.2.15" if s.respond_to? :installed_by_version

  if s.respond_to? :specification_version then
    s.specification_version = 4
  end

  if s.respond_to? :add_runtime_dependency then
    s.add_runtime_dependency(%q<railties>.freeze, [">= 3.0"])
  else
    s.add_dependency(%q<railties>.freeze, [">= 3.0"])
  end
end
