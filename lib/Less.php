<?php

/**
 * @author Jáchym Toušek
 */
class Less extends lessc {

    public $minimize = false;

    public $in, $out;
    public $imgPath = '';

    private $property = '';

    function __construct($in, $out) {
        call_user_func_array('parent::__construct', func_get_args());
        $this->vPrefix = '$';
        $this->mPrefix = '@';
        $this->minimize = false;
        $this->in = $in;
        $this->out = $out;
    }

    function multiplyTags($tags = array(' '), $d = null) {
        if ($d === null) $d = count($this->env) - 1;

        $parents = $d == 0 ? $this->env[$d]['__tags'] : $this->multiplyTags($this->env[$d]['__tags'], $d - 1);

        $rtags = array();
        foreach ($parents as $p) {
            foreach ($tags as $t) {
                if ($t{0} == $this->mPrefix && substr($t, 0, 10) != '@font-face') continue;
                $d = ' ';
                if ($t{0} == ':' || $t{0} == $this->selfSelector) {
                    $t = ltrim($t, $this->selfSelector);
                    $d = '';
                }
                $rtags[] = trim($p.$d.$t);
            }
        }

        return $rtags;
    }

    function color(&$color)	{
        $color = array('color');
        if ($this->match('(#([0-9a-f]{3}-[0-9]{2})|#([0-9a-f]{6}-[0-9]{2})|#([0-9a-f]{8})|#([0-9a-f]{6})|#([0-9a-f]{4})|#([0-9a-f]{3}))', $m)) {
            $num = end($m);
            if (count($m) >= 4 && count($m) <= 6) {
                foreach (str_split(substr($num, 0, 6), 2) as $key => $value) {
                    $color[$key + 1] = hexdec($value);
                }
            } else {
                foreach (str_split(substr($num, 0, 3)) as $key => $value) {
                    $color[$key + 1] = hexdec($value . $value);
                }
            }
            if (strpos($num, '-')) {
                $color[4] = (float) ('0.' . substr($num, -2));
            } elseif (count($m) == 5 || count($m) == 7) {
                $color[4] = round(hexdec(substr($num, -2)) / 256, 2);
            }
            return true;
        }
        return false;
    }

    function fixColor($c) {
        for ($i = 1; $i <= 3; $i++) {
            if ($c[$i] < 0) $c[$i] = 0;
            elseif ($c[$i] > 255) $c[$i] = 255;
            else $c[$i] = floor($c[$i]);
        }
        if (array_key_exists(4, $c)) {
            if ($c[4] < 0) $c[4] = 0;
            elseif ($c[4] >= 1) unset($c[4]);
            else $c[4] = round($c[4], 2);
        }
        return $c;
    }

    function removeComments($text) {
        return ltrim(parent::removeComments($text));
    }

    function compileProperty($name, $value, $level = 0) {
        $this->property = $name;
        $props = array();
        foreach ($value as $v) {
            $out = trim($this->compileValue($v));
            if ($out == '') continue;
            $props[] = str_repeat($this->outputSpace(2), $level) . $name . ':' . $this->outputSpace() . $out . ';';
        }
        return $props;
    }

  function compileBlock($rtags, $env) {
    if (empty($rtags)) return '';
    $list = array();
    foreach ($env as $name => $value) {
      if (isset($value[0]) && $name{0} != $this->vPrefix && $name != '__args') {
        $list = array_merge($list, $this->compileProperty($name, $value, 1));
      }
    }
    $list = array_unique($list);
    if (count($list) == 0) {
      return '';
    } elseif (count($list) == 1) {
      $list = $this->outputSpace() . trim(end($list)) . $this->outputSpace();
    } else {
      $list = $this->outputLine() . implode($this->outputLine(), $list) . $this->outputLine();
    }
    return implode(',' . $this->outputSpace(), $rtags) . $this->outputSpace() . '{' . $list . '}' . $this->outputLine();
  }

  function compileValue($value) {
    if ($value[0] == 'function' && $color = $this->funcToColor($value)) {
      $value = $color;
    }
    if ($this->isFilter() && $value[0] == 'color' && count($value) == 5) {
      $out = '#';
      $alpha = floor($value[4] * 255);
      $out .= ($alpha < 16 ? '0' : '') . dechex($alpha);
      for ($i = 1; $i <= 3; $i++) {
        $out .= ($value[$i] < 16 ? '0' : '') . dechex($value[$i]);
      }
      return $out;

    } elseif ($value[0] == 'color') {
        if (count($value) == 5) {
            return 'rgba('.$value[1].','.$value[2].','.$value[3].','.number_format($value[4], 2, '.', '').')';
        }
        $out = '#';
        foreach (range(1,3) as $i)
            $out .= ($value[$i] < 16 ? '0' : '').dechex($value[$i]);
        return $out;
    } else {
      return parent::compileValue($value);
    }
  }

  function isFilter() {
    return $this->property == 'filter' || $this->property == '-ms-filter';
  }

  function outputLine() {
    return $this->minimize ? '' : "\n";
  }

  function outputSpace($count = 1) {
    return $this->minimize ? '' : str_repeat(' ', $count);
  }

  function lib_if($arg) {
    if (count($arg) == 3 && $arg[0] == 'list' && $arg[1] == ',' && (count($arg[2]) == 3 || count($arg[2]) == 4)) {
      $values = array();
      foreach ($arg[2] as $key => $value) {
        $values[$key] = $this->compileValue($value);
      }
      if ($values[0] == $values[1]) {
        return $values[2];
      } else {
        return isset($values[3]) ? $values[3] : '';
      }
    }
  }

  function lib_img($arg) {
    return 'url(\'' . $this->imgPath . $this->lib_unquote($arg) . '\')';
  }

  function lib_imgWidth($arg) {
    list($width) = getimagesize(dirname($this->out) . '/' . $this->imgPath . $this->lib_unquote($arg));
    return $width . 'px';
  }

  function lib_imgHeight($arg) {
    list($width, $height) = getimagesize(dirname($this->out) . '/' . $this->imgPath . $this->lib_unquote($arg));
    return $height . 'px';
  }

    function compile($check = true) {
        if (is_file($this->out) && is_dir($check)) {
            $dir = new \M33\DirectoryIterator($check);
            foreach ($dir as $file) {
                if ($file->getExtension() == 'less' || $file->getExtension() == 'css') {
                    if ($file->getMTime() > filemtime($this->out)) {
                        $check = false;
                    }
                }
            }
        }
        if ($check === false || (is_file($this->in) && (!is_file($this->out) || filemtime($this->in) > filemtime($this->out)))) {
            return file_put_contents($this->out, $this->parse());
        }
    }
  
    public static function ccompile($in, $out) {
        if (version_compare(PHP_VERSION, '5.3.0', '>=')) {
            $less = new static($in, $out);
        } else {
            $less = new self($in, $out);
        }
        return $less->compile();
    }
  
    //TODO
    function at_import() {}
    function at_include() {}

}
