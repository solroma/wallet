package so.onekey.app.wallet.viewManager.recyclerList;


import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;

public class RecyclerListItemViewManager extends ViewGroupManager<RecyclerViewItemView> {
  private static String REACT_CLASS = "RecyclerListItemView";

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  protected RecyclerViewItemView createViewInstance(ThemedReactContext reactContext) {
    return new RecyclerViewItemView(reactContext);
  }

  @ReactProp(name = "itemIndex")
  public void setItemIndex(RecyclerViewItemView view, int itemIndex) {
    view.setItemIndex(itemIndex);
  }
}

