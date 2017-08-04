# -*- encoding: utf-8 -*-
require File.expand_path('../lib/data-confirm-modal/version', __FILE__)

Gem::Specification.new do |s|
  s.name        = "data-confirm-modal"
  s.version     = DataConfirmModal::VERSION
  s.platform    = Gem::Platform::RUBY
  s.authors     = ["Marcello Barnaba"]
  s.email       = ["vjt@openssl.it"]
  s.homepage    = "http://github.com/ifad/data-confirm-modal"
  s.summary     = "Use bootstrap modals with Rails' UJS data-confirm"
  s.description = "This gem overrides Rails' UJS behaviour to open up a Bootstrap Modal instead of the browser's built in confirm() dialog"
  s.license	= 'MIT'

  s.required_rubygems_version = ">= 1.3.6"

  s.add_dependency 'railties', '>= 3.0'

  s.files        = `git ls-files`.split("\n")
  s.require_path = 'lib'
end
